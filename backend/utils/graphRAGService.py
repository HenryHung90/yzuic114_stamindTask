import os
import pandas as pd
from pathlib import Path

# GraphRAG 相關引入
from graphrag.config.models.vector_store_schema_config import VectorStoreSchemaConfig
from graphrag.query.context_builder.entity_extraction import EntityVectorStoreKey
from graphrag.query.indexer_adapters import (
    read_indexer_covariates,
    read_indexer_entities,
    read_indexer_relationships,
    read_indexer_reports,
    read_indexer_text_units,
    read_indexer_communities
)
from graphrag.query.structured_search.local_search.mixed_context import LocalSearchMixedContext
from graphrag.query.structured_search.local_search.search import LocalSearch

from graphrag.vector_stores.lancedb import LanceDBVectorStore
from graphrag.config.enums import ModelType
from graphrag.config.models.language_model_config import LanguageModelConfig
from graphrag.language_model.manager import ModelManager
from graphrag.tokenizer.get_tokenizer import get_tokenizer

OUTPUT_DIR = f"{Path(__file__).resolve().parent.parent}/graph_data"
LANCEDB_URI = f"{OUTPUT_DIR}/lancedb"

COMMUNITY_REPORT_TABLE = "community_reports"
ENTITY_TABLE = "entities"
COMMUNITY_TABLE = "communities"
RELATIONSHIP_TABLE = "relationships"
COVARIATE_TABLE = "covariates"
TEXT_UNIT_TABLE = "text_units"
COMMUNITY_LEVEL = 2


class GraphRAGService:
    _instance = None

    @classmethod
    def get_engine(cls, system_prompt=""):
        if cls._instance is None:
            print(f"[GraphRAG] 正在初始化搜尋引擎... 資料路徑: {OUTPUT_DIR}")

            # --- Helper: 安全讀取 Parquet ---
            def load_parquet(table_name):
                path = f"{OUTPUT_DIR}/{table_name}.parquet"
                if not os.path.exists(path):
                    print(f"警告: 找不到檔案 {path}")
                    return pd.DataFrame()  # 回傳空 DataFrame
                if os.path.getsize(path) == 0:
                    print(f"警告: 檔案 {path} 大小為 0，跳過讀取。")
                    return pd.DataFrame()
                return pd.read_parquet(path)

            # 1. 讀取 Entities & Communities
            entity_df = load_parquet(ENTITY_TABLE)
            community_df = load_parquet(COMMUNITY_TABLE)
            report_df = load_parquet(COMMUNITY_REPORT_TABLE)

            if entity_df.empty or community_df.empty:
                raise ValueError("嚴重錯誤: Entities 或 Communities 資料為空，無法啟動引擎。")

            communities = read_indexer_communities(community_df, report_df)
            entities = read_indexer_entities(entity_df, community_df, COMMUNITY_LEVEL)

            # 連接 LanceDB
            description_embedding_store = LanceDBVectorStore(
                vector_store_schema_config=VectorStoreSchemaConfig(
                    index_name="default-entity-description"
                )
            )
            description_embedding_store.connect(db_uri=LANCEDB_URI)

            # 讀取 Relationships
            relationship_df = load_parquet(RELATIONSHIP_TABLE)
            relationships = read_indexer_relationships(relationship_df)

            covariates = None
            covariate_df = load_parquet(COVARIATE_TABLE)
            if not covariate_df.empty:
                claims = read_indexer_covariates(covariate_df)
                covariates = {"claims": claims}

            # 讀取 Reports
            report_df = load_parquet(COMMUNITY_REPORT_TABLE)
            reports = read_indexer_reports(report_df, community_df, COMMUNITY_LEVEL)

            # 讀取 Text Units
            text_unit_df = load_parquet(TEXT_UNIT_TABLE)
            text_units = read_indexer_text_units(text_unit_df)

            # --- 初始化模型 ---
            api_key = os.getenv('OPENAI_KEY')
            if not api_key:
                raise ValueError("未設定 OPENAI_KEY 環境變數")

            chat_config = LanguageModelConfig(
                api_key=api_key,
                type=ModelType.Chat,
                model_provider="openai",
                model="gpt-5.1",
                max_retries=8,
            )
            chat_model = ModelManager().get_or_create_chat_model(
                name="local_search",
                model_type=ModelType.Chat,
                config=chat_config,
            )

            text_embedder = ModelManager().get_or_create_embedding_model(
                name="local_search_embedding",
                model_type=ModelType.Embedding,
                config=LanguageModelConfig(
                    api_key=api_key,
                    type=ModelType.Embedding,
                    model_provider="openai",
                    model="text-embedding-3-large",
                    max_retries=8,
                ),
            )

            tokenizer = get_tokenizer(chat_config)

            # --- 構建 Context ---
            local_context_builder = LocalSearchMixedContext(
                community_reports=reports,
                text_units=text_units,
                entities=entities,
                relationships=relationships,
                covariates=covariates,
                entity_text_embeddings=description_embedding_store,
                embedding_vectorstore_key=EntityVectorStoreKey.ID,
                text_embedder=text_embedder,
                tokenizer=tokenizer,
            )

            local_context_params = {
                # "text_unit_prop": 0.8,
                # "community_prop": 0.2,
                "conversation_history_max_turns": 4,
                # "conversation_history_user_turns_only": True,
                # "top_k_mapped_entities": 8,
                # "top_k_relationships": 8,
                "embedding_vectorstore_key": EntityVectorStoreKey.ID,
                "max_context_tokens": 14000,
            }

            model_params = {
                "max_tokens": 4000,
                "temperature": 0.0,
            }

            try:
                cls._instance = LocalSearch(
                    model=chat_model,
                    context_builder=local_context_builder,
                    tokenizer=tokenizer,
                    model_params=model_params,
                    context_builder_params=local_context_params,
                    system_prompt=system_prompt
                )
                print("[GraphRAG] 引擎初始化完成！")
            except Exception as e:
                print("[GraphRAG] 引擎初始化失敗！")
                raise

        return cls._instance
