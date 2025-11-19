import re
import uuid as uuid_lib
from backend.models import RagEntities, RagCommunities


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
        'PERSON': '#3B82F6',  # 藍色 - 人物
        'ORGANIZATION': '#10B981',  # 綠色 - 組織
        'CONCEPT': '#8B5CF6',  # 紫色 - 概念
        'TECHNOLOGY': '#F59E0B',  # 橙色 - 技術
        'EVENT': '#EF4444',  # 紅色 - 事件
        'LOCATION': '#6366F1',  # 靛色 - 地點
        'METHOD': '#EC4899',  # 粉色 - 方法
        'TOOL': '#14B8A6',  # 青色 - 工具
        'DATA': '#F97316',  # 橙紅色 - 數據
        'PROCESS': '#84CC16',  # 綠黃色 - 流程
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
                            'PERSON': '人物',
                            'ORGANIZATION': '組織',
                            'CONCEPT': '概念',
                            'TECHNOLOGY': '技術',
                            'EVENT': '事件',
                            'LOCATION': '地點',
                            'METHOD': '方法',
                            'TOOL': '工具',
                            'DATA': '數據',
                            'PROCESS': '流程'
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
