import re
import uuid as uuid_lib
from backend.models import RagEntities, RagCommunities, RagRelationships


def extract_graphrag_references(text):
    """
    從 GraphRAG 回應中提取 Entities 和 Reports 資訊
    """
    if not text:
        return {
            'processed_text': '',
            'all_references': []
        }

    # 用來收集不同類型的數據
    data_collections = {}

    # 使用正則表達式匹配 [Data: ...] 格式
    def replace_data_references(match):
        data_content = match.group(1)
        # 分割不同的部分（用分號分隔）
        parts = [part.strip() for part in data_content.split(';')]

        for part in parts:
            type_match = re.match(r'^(\w+)\s*\(([\d,\s]+)\)$', part)
            if type_match:
                data_type, numbers_string = type_match.groups()

                # 跳過 Sources 類型（如果需要的話）
                if data_type == 'Sources':
                    continue
                numbers = [int(num.strip()) for num in numbers_string.split(',')]
                if data_type in data_collections:
                    data_collections[data_type].extend(numbers)
                else:
                    data_collections[data_type] = numbers

        return ''  # 移除原本的 Data 標記

    # 處理文本，移除 Data 標記並提取參考資料
    processed_text = re.sub(r'\[Data:\s*(.*?)\]', replace_data_references, text)

    # 轉換為你要的格式
    all_references = []
    for data_type, numbers in data_collections.items():
        # 去除重複的數字並排序
        unique_numbers = sorted(list(set(numbers)))
        all_references.append({
            'type': data_type,
            'numbers': unique_numbers
        })

    return {
        'processed_text': processed_text.strip(),
        'all_references': all_references
    }


def format_context_data_to_data_tag(context_data):
    """
    將 context_data 轉換為 [Data: ...] 格式
    處理 DataFrame 數據
    """
    data_parts = []

    # 處理各種類型的數據
    for data_type, values in context_data.items():
        # 跳過空值
        if values is None:
            continue

        # 處理 DataFrame 類型
        if hasattr(values, 'empty'):  # 檢查是否為 DataFrame
            if not values.empty:  # 確保 DataFrame 不為空
                # 根據不同的數據類型處理
                if 'id' in values.columns:
                    ids = values['id'].astype(str).tolist()
                    # 過濾掉空值並去重
                    ids = list(set(filter(None, ids)))
                    if ids:  # 確保有 ID
                        # 首字母大寫
                        data_type_capitalized = data_type.capitalize()
                        data_parts.append(f"{data_type_capitalized} ({', '.join(ids)})")

    # 如果沒有任何數據，返回空字符串
    if not data_parts:
        return ""

    # 組合成最終格式
    return f"[Data: {'; '.join(data_parts)}]"


def find_entity_communities(entity_title, task_id):
    """
    根據實體標題找到包含該實體的社群
    由於 entity_ids 是包含 UUID 的字串陣列，需要先找到對應的 UUID
    """
    try:
        # 1. 先根據 title 找到實體的 id (UUID)
        entity = RagEntities.objects.filter(
            task_id=task_id,
            title=entity_title
        ).first()

        if not entity:
            print(f"找不到實體: {entity_title}")
            return []

        entity_uuid = str(entity.id)  # 轉換為字串格式的 UUID
        print(f"實體 {entity_title} 的 UUID: {entity_uuid}")

        # 2. 在社群的 entity_ids 中搜尋包含此 UUID 的社群
        # 使用 __icontains 來搜尋包含此 UUID 的社群
        communities = RagCommunities.objects.filter(
            task_id=task_id,
            entity_ids__icontains=entity_uuid
        )

        print(f"找到 {communities.count()} 個包含實體 {entity_title} 的社群")
        return list(communities)

    except Exception as e:
        print(f"查找實體社群時發生錯誤: {e}")
        return []


def parse_entity_ids_from_community(entity_ids_array):
    """
    從社群的 entity_ids 陣列中解析出實際的 UUID 列表
    修正版本：使用正則表達式來正確提取完整的 UUID
    """
    parsed_uuids = []

    # UUID 的正則表達式模式
    uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

    for entity_id_string in entity_ids_array:
        print(f"解析字串: {entity_id_string}")

        # 使用正則表達式找出所有的 UUID
        uuids = re.findall(uuid_pattern, entity_id_string, re.IGNORECASE)
        parsed_uuids.extend(uuids)

        print(f"從字串中提取到的 UUID: {uuids}")

    # 去重並返回
    unique_uuids = list(set(parsed_uuids))
    print(f"解析出的所有唯一 UUID: {unique_uuids}")
    return unique_uuids


def get_entities_from_uuids(uuids, task_id):
    """
    根據 UUID 列表獲取實體資訊
    """
    print(f"查詢 UUID 列表: {uuids}")

    # 過濾掉無效的 UUID
    valid_uuids = []
    for uuid_str in uuids:
        try:
            # 嘗試驗證 UUID 格式
            uuid_lib.UUID(uuid_str)
            valid_uuids.append(uuid_str)
        except ValueError:
            print(f"無效的 UUID: {uuid_str}")
            continue

    print(f"有效的 UUID 列表: {valid_uuids}")

    if not valid_uuids:
        return []

    entities = RagEntities.objects.filter(
        task_id=task_id,
        id__in=valid_uuids
    ).values('id', 'title', 'description', 'type', 'degree', 'frequency')

    entities_list = list(entities)
    print(f"找到 {len(entities_list)} 個實體")
    return entities_list


def generate_next_step_graph(entities_info, task_id):
    """
    整合社群中心和社群探索推薦，並以圖形結構（nodes和edges）的方式回傳

    Args:
        entities_info: 實體信息字典
        task_id: 任務ID

    Returns:
        包含 nodes 和 edges 的圖形數據結構
    """
    from backend.utils.recommendation_utils import (
        generate_community_center_recommendations,
        generate_community_exploration_recommendations
    )

    # 獲取實體標題列表
    entity_titles = [data['title'] for data in entities_info.values()]

    # 獲取社群中心和社群探索推薦
    community_centers = generate_community_center_recommendations(entities_info, task_id)
    community_exploration = generate_community_exploration_recommendations(entities_info, task_id)

    # 顏色映射
    color_map = {
        'MODULE': '#3B82F6',  # 藍色 - 模組
        'CONCEPT': '#8B5CF6',  # 紫色 - 概念
        'UI_COMPONENT': '#EC4899',  # 粉色 - UI元件
        'CSS_SELECTOR': '#14B8A6',  # 青色 - CSS選擇器
        'CSS_PROPERTY': '#06B6D4',  # 淺藍色 - CSS屬性
        'HTML_TAG': '#F97316',  # 橙紅色 - HTML標籤
        'JAVASCRIPT_FUNCTION': '#EF4444',  # 紅色 - JavaScript函數
        'DOM_EVENT': '#F59E0B',  # 橙色 - DOM事件
        'VARIABLE': '#84CC16',  # 綠黃色 - 變數
        'TECHNOLOGY': '#10B981',  # 綠色 - 技術
        'IMPLEMENTATION_DETAIL': '#6366F1'  # 靛色 - 實作細節
    }

    # 初始化節點和邊
    nodes = []
    edges = []
    entity_id_map = {}  # 實體名稱到ID的映射
    current_node_id = 0
    current_edge_id = 1

    # 首先添加原始實體作為中心節點
    for title in entity_titles:
        # 查找實體詳細資訊
        entity_detail = None
        for entity_id, entity_data in entities_info.items():
            if entity_data['title'] == title:
                entity_detail = entity_data
                break

        entity_type = entity_detail.get('type', 'CONCEPT') if entity_detail else 'CONCEPT'
        color = color_map.get(entity_type, '#3B82F6')  # 默認藍色

        nodes.append({
            'id': current_node_id,
            'label': title,
            'color': color,
            'size': 150,  # 原始實體較大
            'original': True,
            'description': entity_detail.get('description', '原始查詢實體') if entity_detail else '原始查詢實體'
        })

        entity_id_map[title] = current_node_id
        current_node_id += 1

    # 處理社群中心推薦
    for center_rec in community_centers:
        community_title = center_rec['community_title']
        community_description = center_rec.get('community_description', '')

        # 如果沒有描述，生成一個基於社群中心實體的描述
        if not community_description:
            entity_names = [entity['title'] for entity in center_rec['center_entities'][:3]]
            entity_names_text = '、'.join(entity_names)
            community_description = f"這個社群包含了 {entity_names_text} 等相關概念，是一個重要的知識群組。"

        # 添加重要性信息
        importance_score = center_rec.get('importance_score', 50)
        if importance_score > 70:
            community_description += " 這是一個非常核心的知識社群。"
        elif importance_score > 50:
            community_description += " 這是一個重要的知識社群。"

        # 添加社群節點
        nodes.append({
            'id': current_node_id,
            'label': f"社群: {community_title}",
            'color': '#10B981',  # 社群用綠色
            'size': 100 + importance_score / 2,  # 根據重要性調整大小
            'community': True,
            'description': community_description,
            'importance_score': importance_score
        })

        community_node_id = current_node_id
        current_node_id += 1

        # 添加社群中心實體
        for entity in center_rec['center_entities']:
            if entity['title'] not in entity_id_map:
                entity_color = color_map.get(entity['type'], '#64748b')

                # 查找實體的實際描述
                entity_description = None
                # 首先檢查 entity 是否有描述
                if 'description' in entity and entity['description']:
                    entity_description = entity['description']
                else:
                    # 如果沒有，嘗試從 entities_info 中查找
                    for _, entity_data in entities_info.items():
                        if entity_data['title'] == entity['title'] and 'description' in entity_data and entity_data[
                            'description']:
                            entity_description = entity_data['description']
                            break

                # 如果仍然沒有找到描述，使用默認生成的描述
                if not entity_description:
                    entity_description = f"{entity['title']}是{community_title}社群中的一個重要概念。"

                    # 添加類型信息（如果有）
                    if 'type' in entity and entity['type']:
                        entity_type_desc = {
                            'MODULE': '模組',
                            'CONCEPT': '概念',
                            'UI_COMPONENT': 'UI元件',
                            'CSS_SELECTOR': 'CSS選擇器',
                            'CSS_PROPERTY': 'CSS屬性',
                            'HTML_TAG': 'HTML標籤',
                            'JAVASCRIPT_FUNCTION': 'JavaScript函數',
                            'DOM_EVENT': 'DOM事件',
                            'VARIABLE': '變數',
                            'TECHNOLOGY': '技術',
                            'IMPLEMENTATION_DETAIL': '實作細節'
                        }.get(entity['type'], '實體')
                        entity_description += f" 這是一個{entity_type_desc}。"

                    # 添加度數信息（如果有）
                    if 'degree' in entity and entity['degree'] > 3:
                        entity_description += f" 它與其他{entity['degree']}個概念有關聯。"

                nodes.append({
                    'id': current_node_id,
                    'label': entity['title'],
                    'color': entity_color,
                    'size': 80 + entity['degree'] * 2,  # 根據度數調整大小
                    'community_center': True,
                    'description': entity_description
                })

                entity_id_map[entity['title']] = current_node_id
                current_node_id += 1

            # 添加邊 (社群到實體)
            edges.append({
                'id': f'e{current_edge_id}',
                'from': community_node_id,
                'to': entity_id_map[entity['title']],
                'label': '包含',
                'color': '#64748b',
                'width': 3
            })
            current_edge_id += 1

        # 連接原始實體到社群
        for title in entity_titles:
            if title in entity_id_map:
                edges.append({
                    'id': f'e{current_edge_id}',
                    'from': entity_id_map[title],
                    'to': community_node_id,
                    'label': '屬於',
                    'color': '#3B82F6',
                    'width': 5
                })
                current_edge_id += 1

    # 處理社群探索推薦
    for explore_rec in community_exploration:
        exploration_type = explore_rec['exploration_type']
        community_title = explore_rec['community_title']

        # 生成社群描述
        if exploration_type == 'higher_level':
            community_description = f"{community_title}是一個更廣泛的概念領域，包含了您感興趣的主題。探索這個領域可以幫助您建立更全面的知識框架。"
        else:
            community_description = f"{community_title}是一個更專業、更深入的知識領域，探索這個領域可以幫助您掌握更多細節和實踐知識。"

        # 添加關鍵實體信息
        if explore_rec['key_entities']:
            entity_names = explore_rec['key_entities'][:3]
            entity_names_text = '、'.join(entity_names)
            community_description += f" 關鍵概念包括：{entity_names_text}等。"

        # 添加探索社群節點
        nodes.append({
            'id': current_node_id,
            'label': f"{community_title}",
            'color': '#8B5CF6' if exploration_type == 'higher_level' else '#F59E0B',  # 高層級紫色，低層級橙色
            'size': 90,
            'exploration': True,
            'description': community_description,
            'exploration_type': exploration_type
        })

        exploration_node_id = current_node_id
        current_node_id += 1

        # 添加關鍵實體
        for key_entity in explore_rec['key_entities']:
            if key_entity not in entity_id_map:
                # 查找實體的實際描述
                entity_description = None
                # 嘗試從 entities_info 中查找
                for _, entity_data in entities_info.items():
                    if entity_data['title'] == key_entity and 'description' in entity_data and entity_data[
                        'description']:
                        entity_description = entity_data['description']
                        break

                # 如果沒有找到描述，使用生成的描述
                if not entity_description:
                    if exploration_type == 'higher_level':
                        entity_description = f"{key_entity}是{community_title}這個更廣泛領域中的一個重要概念。"
                    else:
                        entity_description = f"{key_entity}是{community_title}這個專業領域中的一個具體概念或技術。"

                nodes.append({
                    'id': current_node_id,
                    'label': key_entity,
                    'color': '#64748b',  # 灰色
                    'size': 70,
                    'exploration_entity': True,
                    'description': entity_description
                })

                entity_id_map[key_entity] = current_node_id
                current_node_id += 1

            # 添加邊 (社群到實體)
            edges.append({
                'id': f'e{current_edge_id}',
                'from': exploration_node_id,
                'to': entity_id_map[key_entity],
                'label': '包含',
                'color': '#64748b',
                'width': 2
            })
            current_edge_id += 1

        # 連接原始實體到探索社群
        for title in entity_titles:
            if title in entity_id_map:
                # 使用更白話的表達方式
                if exploration_type == 'higher_level':
                    edge_label = '是其中一種'  # 替代「抽象化」
                    edge_color = '#8B5CF6'  # 紫色
                else:
                    edge_label = '包含這個'  # 替代「具體化」
                    edge_color = '#F59E0B'  # 橙色

                edges.append({
                    'id': f'e{current_edge_id}',
                    'from': entity_id_map[title],
                    'to': exploration_node_id,
                    'label': edge_label,
                    'color': edge_color,
                    'width': 4
                })
                current_edge_id += 1

    # 構建最終結果
    return [{
        'recommendation_type': 'next_step',
        'total_entities': len(entity_id_map),
        'total_relations': len(edges),
        'graph_data': {
            'nodes': nodes,
            'edges': edges
        },
        'knowledge_analysis': {
            'community_centers_count': len(community_centers),
            'community_exploration_count': len(community_exploration),
            'original_entities': entity_titles
        },
        'learning_suggestions': [
                                    f"探索社群: {center['community_title']}" for center in community_centers[:3]
                                ] + [
                                    f"{'概念理解' if explore['exploration_type'] == 'higher_level' else '深入細節'}: {explore['community_title']}"
                                    for explore in community_exploration[:2]
                                ],
        'summary': f"發現 {len(community_centers)} 個相關社群中心和 {len(community_exploration)} 個社群探索方向，共 {len(nodes)} 個節點，{len(edges)} 個知識連接"
    }]


def generate_entity_relationship_graph(data_text, task_id, importance_threshold=1.5, min_entities=10,
                                       include_all_relationships=False):
    """
    從 [Data: ...] 格式的文本中提取實體和關係資訊，構建圖形結構
    保留足夠的節點以提供更全面的知識圖譜

    Args:
        data_text: 包含 [Data: ...] 格式的文本
        task_id: 任務 ID
        importance_threshold: 重要性閾值，度數或頻率大於等於此值的節點被視為重要節點
        min_entities: 最少要保留的實體數量，即使其重要性低於閾值
        include_all_relationships: 是否包含所有連接到重要實體的次要實體

    Returns:
        包含 nodes 和 edges 的圖形數據結構
    """
    # 提取引用的資料
    references = extract_graphrag_references(data_text)
    all_references = references['all_references']

    # 初始化存儲實體和關係的ID
    entity_ids = []
    relationship_ids = []

    # 從引用中提取ID
    for reference in all_references:
        if reference['type'] == 'Entities':
            entity_ids.extend(reference['numbers'])
        elif reference['type'] == 'Relationships':
            relationship_ids.extend(reference['numbers'])

    # 如果沒有找到實體或關係，返回空結果
    if not entity_ids and not relationship_ids:
        return {
            'nodes': [],
            'edges': [],
        }

    # 從資料庫獲取實體和關係資訊
    entities = RagEntities.objects.filter(
        task_id=task_id,
        human_readable_id__in=entity_ids
    ).values('id', 'title', 'description', 'type', 'degree', 'frequency', 'human_readable_id')

    relationships = RagRelationships.objects.filter(
        task_id=task_id,
        human_readable_id__in=relationship_ids
    ).values('id', 'source', 'target', 'description', 'weight', 'human_readable_id')

    # 顏色映射表
    color_map = {
        'MODULE': '#3B82F6',  # 藍色
        'CONCEPT': '#8B5CF6',  # 紫色
        'UI_COMPONENT': '#EC4899',  # 粉色
        'CSS_SELECTOR': '#14B8A6',  # 青色
        'CSS_PROPERTY': '#06B6D4',  # 淺藍色
        'HTML_TAG': '#F97316',  # 橙紅色
        'JAVASCRIPT_FUNCTION': '#EF4444',  # 紅色
        'DOM_EVENT': '#F59E0B',  # 橙色
        'VARIABLE': '#84CC16',  # 綠黃色
        'TECHNOLOGY': '#10B981',  # 綠色
        'IMPLEMENTATION_DETAIL': '#6366F1'  # 靛色
    }

    # 計算每個實體的重要性得分
    entity_importance = {}
    entity_title_to_data = {}

    for entity in entities:
        title_upper = entity['title'].upper()
        # 根據度數和頻率計算重要性，增加權重以保留更多實體
        importance = 0
        if 'degree' in entity and entity['degree']:
            importance += entity['degree']
        if 'frequency' in entity and entity['frequency']:
            importance += entity['frequency'] * 0.8  # 增加頻率的權重

        entity_importance[title_upper] = importance
        entity_title_to_data[title_upper] = entity

    # 統計各個實體在關係中出現的次數
    relation_counts = {}
    related_entities = set()  # 記錄所有參與關係的實體

    for relation in relationships:
        source_title = str(relation['source']).upper()
        target_title = str(relation['target']).upper()

        related_entities.add(source_title)
        related_entities.add(target_title)

        if source_title not in relation_counts:
            relation_counts[source_title] = 0
        if target_title not in relation_counts:
            relation_counts[target_title] = 0

        relation_counts[source_title] += 1
        relation_counts[target_title] += 1

    # 更新實體重要性得分，將關係次數也考慮進去
    for title, count in relation_counts.items():
        if title in entity_importance:
            entity_importance[title] += count * 0.7  # 增加關係數量的權重
        else:
            entity_importance[title] = count * 0.7

    # 篩選重要節點，並確保至少保留最低數量的實體
    sorted_entities = sorted(entity_importance.items(), key=lambda x: x[1], reverse=True)

    # 確保至少保留min_entities個實體
    important_count = sum(1 for _, score in sorted_entities if score >= importance_threshold)
    min_count_to_keep = max(min_entities, important_count)

    important_entities = {}
    for i, (title, score) in enumerate(sorted_entities):
        if i < min_count_to_keep or score >= importance_threshold:
            important_entities[title] = score

    # 如果需要包含所有連接到重要實體的次要實體
    if include_all_relationships:
        for relation in relationships:
            source_title = str(relation['source']).upper()
            target_title = str(relation['target']).upper()

            if source_title in important_entities and target_title not in important_entities:
                important_entities[target_title] = importance_threshold / 2  # 給較低的重要性分數
            elif target_title in important_entities and source_title not in important_entities:
                important_entities[source_title] = importance_threshold / 2  # 給較低的重要性分數

    # 初始化節點和邊
    nodes = []
    edges = []
    entity_title_map = {}  # 實體標題到節點ID的映射
    current_node_id = 0

    # 將重要實體轉換為節點
    for title_upper, importance_score in important_entities.items():
        if title_upper in entity_title_to_data:
            entity = entity_title_to_data[title_upper]
            entity_type = entity.get('type', 'CONCEPT')
            color = color_map.get(entity_type, '#3B82F6')  # 默認藍色

            # 根據重要性調整大小
            size = 60 + min(importance_score * 5, 40)  # 基礎大小60，最大增加40

            nodes.append({
                'id': current_node_id,
                'label': entity['title'],
                'color': color,
                'size': size,
                'type': entity_type,
                'description': entity.get('description', f"{entity['title']} 是一個 {entity_type.lower()} 類型的實體。"),
                'original_id': str(entity['id']),
                'human_readable_id': entity.get('human_readable_id'),
                'importance_score': importance_score
            })

            entity_title_map[title_upper] = current_node_id
            current_node_id += 1
        else:
            # 處理關係中出現但數據庫中沒有的重要實體
            nodes.append({
                'id': current_node_id,
                'label': title_upper.capitalize(),
                'color': '#64748b',  # 灰色 - 未知類型
                'size': 60 + min(importance_score * 3, 30),
                'type': 'UNKNOWN',
                'description': f"{title_upper.capitalize()} 是通過關係引用的重要實體。",
                'discovered_via_relation': True,
                'importance_score': importance_score
            })

            entity_title_map[title_upper] = current_node_id
            current_node_id += 1

    # 只保留重要實體之間的關係
    for idx, relation in enumerate(relationships):
        source_title = str(relation['source']).upper()
        target_title = str(relation['target']).upper()

        if source_title in entity_title_map and target_title in entity_title_map:
            # 根據描述推斷關係類型
            description = relation.get('description', '').upper()

            if 'IS A' in description or 'IS_A' in description:
                relation_type = 'IS_A'
                color = '#8B5CF6'  # 紫色 - 是一種
                label = '是一種'
            elif 'HAS A' in description or 'HAS_A' in description:
                relation_type = 'HAS_A'
                color = '#F59E0B'  # 橙色 - 有一個
                label = '有一個'
            elif 'PART OF' in description or 'PART_OF' in description:
                relation_type = 'PART_OF'
                color = '#10B981'  # 綠色 - 是...的一部分
                label = '是...的一部分'
            elif 'USES' in description:
                relation_type = 'USES'
                color = '#3B82F6'  # 藍色 - 使用
                label = '使用'
            else:
                relation_type = '關聯'
                color = '#64748b'  # 灰色 - 其他關係
                label = '關聯'

            # 根據權重調整線條寬度
            width = 1
            if 'weight' in relation and relation['weight']:
                width = max(1, min(5, relation['weight']))

            edges.append({
                'id': f'e{idx + 1}',
                'from': entity_title_map[source_title],
                'to': entity_title_map[target_title],
                'label': label,
                'color': color,
                'width': width,
                'relation_type': relation_type,
                'human_readable_id': relation.get('human_readable_id')
            })

    # 返回最終結果
    return {
        'nodes': nodes,
        'edges': edges,
        'metadata': {
            'total_entities': len(entities),
            'important_entities': len(nodes),
            'filtered_out': len(entities) - len(nodes),
            'importance_threshold': importance_threshold,
            'min_entities': min_entities,
            'include_all_relationships': include_all_relationships
        }
    }
