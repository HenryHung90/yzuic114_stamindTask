import os
import sys
from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):

        # 2. 避免在開發環境 (runserver) 的 Reload 模式下重複載入
        # Django runserver 預設會有兩個 process (一個監控檔案變更，一個執行 server)
        # 只希望在主執行緒載入
        if 'runserver' in sys.argv and os.environ.get('RUN_MAIN') != 'true':
            return

        try:
            from backend.utils.graphRAGService import GraphRAGService
            # 預先載入引擎，但不在此處執行，避免在多進程環境中重複初始化
            GraphRAGService.get_engine()
            print("[System] GraphRAG Warmed up successfully.")
        except Exception as e:
            print(f"⚠️ GraphRAGService 註冊失敗: {e}")
