from backend.models import RagEntities, RagRelationships, RagCommunities
from .graphrag_utils import find_entity_communities, parse_entity_ids_from_community, get_entities_from_uuids


def generate_community_center_recommendations(entities_info, task_id):
    """
    生成下一個社群重心的建議
    基於當前實體找到相關社群，並推薦社群的重心實體
    """
    entity_titles = [data['title'] for data in entities_info.values()]
    community_recommendations = []

    try:
        # 1. 找到當前實體所屬的社群
        current_communities = set()

        for entity_title in entity_titles:
            communities = find_entity_communities(entity_title, task_id)
            for community in communities:
                current_communities.add(community.community)

        print(f"當前實體涉及的社群: {current_communities}")

        if not current_communities:
            print("沒有找到直接相關的社群")
            return []

        # 2. 尋找相鄰社群（同層級或子社群）
        related_communities = []

        for community_id in current_communities:
            try:
                current_community = RagCommunities.objects.get(
                    task_id=task_id,
                    community=community_id
                )

                # 找同層級的其他社群
                same_level_communities = RagCommunities.objects.filter(
                    task_id=task_id,
                    level=current_community.level,
                    parent=current_community.parent
                ).exclude(community=community_id)

                # 找子社群
                child_communities = RagCommunities.objects.filter(
                    task_id=task_id,
                    parent=community_id
                )

                # 找父社群的其他子社群
                if current_community.parent != -1:
                    sibling_communities = RagCommunities.objects.filter(
                        task_id=task_id,
                        parent=current_community.parent
                    ).exclude(community=community_id)
                    related_communities.extend(sibling_communities)

                related_communities.extend(same_level_communities)
                related_communities.extend(child_communities)

            except RagCommunities.DoesNotExist:
                continue

        print(f"找到 {len(related_communities)} 個相關社群")

        # 3. 為每個相關社群找出重心實體
        for community in related_communities[:5]:  # 限制數量
            if not community.entity_ids:
                continue

            print(f"處理社群 {community.community}: {community.title}")

            # 解析社群中的實體 UUID
            entity_uuids = parse_entity_ids_from_community(community.entity_ids)

            if not entity_uuids:
                print(f"社群 {community.community} 沒有有效的實體 UUID")
                continue

            # 獲取這些實體的詳細資訊
            community_entities_data = get_entities_from_uuids(entity_uuids, task_id)

            if community_entities_data:
                # 按度數和頻率排序
                community_entities_data.sort(key=lambda x: (x['degree'], x['frequency']), reverse=True)

                # 取前3個作為社群重心
                center_entities = community_entities_data[:3]

                # 計算社群重要性分數
                total_degree = sum(entity['degree'] for entity in center_entities)
                total_frequency = sum(entity['frequency'] for entity in center_entities)
                importance_score = (total_degree * 0.6) + (total_frequency * 0.4)

                community_recommendations.append({
                    'community_id': community.community,
                    'community_title': community.title,
                    'community_level': community.level,
                    'community_size': community.size,
                    'center_entities': [
                        {
                            'title': entity['title'],
                            'type': entity['type'],
                            'degree': entity['degree'],
                            'frequency': entity['frequency'],
                            'description': entity['description']
                        } for entity in center_entities
                    ],
                    'importance_score': importance_score,
                    'recommendation_type': 'community_center',
                })

        # 按重要性分數排序
        community_recommendations.sort(key=lambda x: x['importance_score'], reverse=True)

        print(f"生成了 {len(community_recommendations)} 個社群重心推薦")
        return community_recommendations[:5]  # 返回前5個推薦

    except Exception as e:
        print(f"生成社群重心推薦時發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        return []


def generate_community_exploration_recommendations(entities_info, task_id):
    """
    生成社群探索建議
    基於當前實體的社群關係，推薦探索路徑
    """
    entity_titles = [data['title'] for data in entities_info.values()]
    exploration_recommendations = []

    try:
        # 找到當前實體的社群層級分布
        community_levels = {}

        for entity_title in entity_titles:
            communities = find_entity_communities(entity_title, task_id)

            for community in communities:
                level = community.level
                if level not in community_levels:
                    community_levels[level] = []
                community_levels[level].append(community)

        print(f"社群層級分布: {community_levels.keys()}")

        # 推薦不同層級的探索
        for level, communities in community_levels.items():
            # 推薦上一層級（更抽象的概念）
            if level > 0:
                parent_communities = RagCommunities.objects.filter(
                    task_id=task_id,
                    level=level - 1
                )

                for parent_community in parent_communities[:2]:
                    if parent_community.entity_ids:
                        # 解析並獲取實體資訊
                        entity_uuids = parse_entity_ids_from_community(parent_community.entity_ids)

                        if entity_uuids:
                            entities_data = get_entities_from_uuids(entity_uuids, task_id)

                            if entities_data:
                                # 按度數排序，取前2個
                                entities_data.sort(key=lambda x: x['degree'], reverse=True)
                                top_entities = entities_data[:2]

                                exploration_recommendations.append({
                                    'exploration_type': 'higher_level',
                                    'community_title': parent_community.title,
                                    'level': parent_community.level,
                                    'key_entities': [entity['title'] for entity in top_entities],
                                    'reason': f'探索更高層級的抽象概念，理解 {parent_community.title} 的整體架構',
                                    'recommendation_type': 'community_exploration'
                                })

            # 推薦下一層級（更具體的概念）
            child_communities = RagCommunities.objects.filter(
                task_id=task_id,
                level=level + 1,
                parent__in=[c.community for c in communities]
            )

            for child_community in child_communities[:2]:
                if child_community.entity_ids:
                    # 解析並獲取實體資訊
                    entity_uuids = parse_entity_ids_from_community(child_community.entity_ids)

                    if entity_uuids:
                        entities_data = get_entities_from_uuids(entity_uuids, task_id)

                        if entities_data:
                            # 按頻率排序，取前2個
                            entities_data.sort(key=lambda x: x['frequency'], reverse=True)
                            top_entities = entities_data[:2]

                            exploration_recommendations.append({
                                'exploration_type': 'deeper_level',
                                'community_title': child_community.title,
                                'level': child_community.level,
                                'key_entities': [entity['title'] for entity in top_entities],
                                'reason': f'深入探索 {child_community.title} 的具體實現和細節',
                                'recommendation_type': 'community_exploration'
                            })

        print(f"生成了 {len(exploration_recommendations)} 個社群探索推薦")
        return exploration_recommendations[:6]

    except Exception as e:
        print(f"生成社群探索推薦時發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        return []


def generate_related_knowledge_recommendations(entities_info, task_id):
    """
    生成相關知識推薦
    基於實體的類型和頻率，找出相關的知識點
    策略：找到與當前實體相關的其他實體，按權重和頻率排序，構建知識關聯圖譜
    返回格式：適合前端圖譜顯示的 nodes 和 edges 格式
    """
    entity_titles = [data['title'] for data in entities_info.values()]

    try:
        # 收集所有相關關係
        all_relations = []

        # 找出與當前實體相關的關係（作為target）
        target_relations = RagRelationships.objects.filter(
            task_id=task_id,
            target__in=entity_titles
        ).values('source', 'target', 'description', 'weight')

        # 找出與當前實體相關的關係（作為source）
        source_relations = RagRelationships.objects.filter(
            task_id=task_id,
            source__in=entity_titles
        ).values('source', 'target', 'description', 'weight')

        # 合併所有關係
        for rel in target_relations:
            all_relations.append({
                'source': rel['source'],
                'target': rel['target'],
                'description': rel['description'],
                'weight': rel['weight'],
                'direction': 'incoming'
            })

        for rel in source_relations:
            all_relations.append({
                'source': rel['source'],
                'target': rel['target'],
                'description': rel['description'],
                'weight': rel['weight'],
                'direction': 'outgoing'
            })

        # 去重（避免重複的關係）
        unique_relations = {}
        for rel in all_relations:
            key = f"{rel['source']}-{rel['target']}"
            if key not in unique_relations or unique_relations[key]['weight'] < rel['weight']:
                unique_relations[key] = rel

        all_relations = list(unique_relations.values())

        if not all_relations:
            return []

        # 按權重排序，取前15個關係
        all_relations.sort(key=lambda x: x['weight'], reverse=True)
        top_relations = all_relations[:15]

        # 收集所有涉及的實體
        all_entities = set()
        for rel in top_relations:
            all_entities.add(rel['source'])
            all_entities.add(rel['target'])

        # 獲取實體詳細信息
        entities_details = {}
        for entity_name in all_entities:
            try:
                entity = RagEntities.objects.get(task_id=task_id, title=entity_name)
                entities_details[entity_name] = {
                    'title': entity.title,
                    'type': entity.type,
                    'frequency': entity.frequency,
                    'degree': entity.degree,
                    'description': entity.description or ''
                }
            except RagEntities.DoesNotExist:
                # 如果找不到實體詳細信息，使用默認值
                entities_details[entity_name] = {
                    'title': entity_name,
                    'type': 'CONCEPT',
                    'frequency': 1,
                    'degree': 1,
                    'description': ''
                }

        # 構建節點
        nodes = []
        entity_id_map = {}
        current_node_id = 0

        # 計算節點大小的範圍
        if entities_details:
            max_frequency = max([e['frequency'] for e in entities_details.values()])
            min_frequency = min([e['frequency'] for e in entities_details.values()])
            max_degree = max([e['degree'] for e in entities_details.values()])
            min_degree = min([e['degree'] for e in entities_details.values()])
        else:
            max_frequency = min_frequency = max_degree = min_degree = 1

        for entity_name, entity_data in entities_details.items():
            # 判斷是否為原始查詢實體
            is_original = entity_name in entity_titles

            # 計算節點大小 (60-150 範圍)
            frequency_score = 0
            degree_score = 0

            if max_frequency > min_frequency:
                frequency_score = (entity_data['frequency'] - min_frequency) / (max_frequency - min_frequency)
            if max_degree > min_degree:
                degree_score = (entity_data['degree'] - min_degree) / (max_degree - min_degree)

            # 綜合分數
            combined_score = (frequency_score * 0.4) + (degree_score * 0.6)
            size = 60 + combined_score * 90

            # 原始實體稍大一些
            if is_original:
                size += 20

            # 設定顏色：主實體藍色，其他灰色
            color = '#3B82F6' if is_original else '#64748b'

            nodes.append({
                'id': current_node_id,
                'label': entity_name,
                'color': color,
                'size': int(size)
            })

            entity_id_map[entity_name] = current_node_id
            current_node_id += 1

        # 構建邊
        edges = []
        current_edge_id = 1

        # 計算邊寬度的範圍
        if top_relations:
            max_weight = max([r['weight'] for r in top_relations])
            min_weight = min([r['weight'] for r in top_relations])
        else:
            max_weight = min_weight = 1

        for relation in top_relations:
            source_id = entity_id_map.get(relation['source'])
            target_id = entity_id_map.get(relation['target'])

            if source_id is not None and target_id is not None:
                # 計算邊寬度 (1-15 範圍)
                if max_weight > min_weight:
                    width = 1 + (relation['weight'] - min_weight) / (max_weight - min_weight) * 14
                else:
                    width = 8

                edges.append({
                    'id': f'e{current_edge_id}',
                    'from': source_id,
                    'to': target_id,
                    'label': str(int(width)),  # 使用 width 作為 label
                    'color': '#64748b',
                    'width': int(width)
                })
                current_edge_id += 1

        # 分析相關知識類型分布
        type_distribution = {}
        for entity_data in entities_details.values():
            entity_type = entity_data['type']
            if entity_type not in type_distribution:
                type_distribution[entity_type] = 0
            type_distribution[entity_type] += 1

        # 找出最重要的相關實體（除了原始實體）
        related_entities = []
        for entity_name, entity_data in entities_details.items():
            if entity_name not in entity_titles:  # 排除原始實體
                # 計算重要性分數
                importance_score = (entity_data['frequency'] * 0.4) + (entity_data['degree'] * 0.6)
                related_entities.append({
                    'title': entity_name,
                    'type': entity_data['type'],
                    'frequency': entity_data['frequency'],
                    'degree': entity_data['degree'],
                    'importance_score': importance_score,
                    'description': entity_data['description']
                })

        # 按重要性排序
        related_entities.sort(key=lambda x: x['importance_score'], reverse=True)

        # 構建最終結果
        final_result = {
            'recommendation_type': 'related_knowledge',
            'total_entities': len(entities_details),
            'total_relations': len(top_relations),
            'graph_data': {
                'nodes': nodes,
                'edges': edges
            },
            'knowledge_analysis': {
                'type_distribution': type_distribution,
                'top_related_entities': related_entities[:8],  # 前8個最重要的相關實體
                'original_entities': entity_titles,
                'connection_strength': {
                    'max_weight': max_weight,
                    'min_weight': min_weight,
                    'avg_weight': sum([r['weight'] for r in top_relations]) / len(top_relations) if top_relations else 0
                }
            },
            'learning_suggestions': [
                f"探索 {entity['title']} ({entity['type']}) - 重要性分數: {entity['importance_score']:.2f}"
                for entity in related_entities[:5]
            ],
            'summary': f"發現 {len(related_entities)} 個相關知識點，涵蓋 {len(type_distribution)} 種類型，共 {len(edges)} 個知識連接"
        }

        return [final_result]

    except Exception as e:
        print(f"生成相關知識推薦時發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        return []


def generate_deep_exploration_recommendations(entities_info, task_id):
    """
    生成深入探討的知識推薦
    基於實體的度數和複雜關係，推薦深度學習內容
    策略：找到 complexity_score 前3高的實體，然後推薦其 weight 前五高的關係
    返回格式：適合前端圖譜顯示的 nodes 和 edges 格式，所有推薦合併在一個圖譜中
    """
    # 找出高度數的實體（連接較多的核心概念）
    high_degree_entities = []
    for entity_id, entity_data in entities_info.items():
        if entity_data['degree'] >= 3:  # 度數較高的實體
            high_degree_entities.append(entity_data['title'])

    deep_exploration = []

    # 為高度數實體找出複雜的關係網絡
    for entity_title in high_degree_entities:
        # 找出這個實體的所有關係（作為source和target）
        outgoing_relations = RagRelationships.objects.filter(
            task_id=task_id,
            source=entity_title
        ).values('target', 'description', 'weight')

        incoming_relations = RagRelationships.objects.filter(
            task_id=task_id,
            target=entity_title
        ).values('source', 'description', 'weight')

        # 構建關係網絡
        network = {
            'core_concept': entity_title,
            'outgoing_connections': list(outgoing_relations),
            'incoming_connections': list(incoming_relations),
            'total_connections': len(outgoing_relations) + len(incoming_relations),
            'recommendation_type': 'deep_exploration'
        }

        # 計算複雜度分數
        for entity_id, entity_data in entities_info.items():
            if entity_data['title'] == entity_title:
                complexity_score = network['total_connections'] * entity_data['frequency']
                network['complexity_score'] = complexity_score
                network['entity_degree'] = entity_data['degree']
                network['entity_frequency'] = entity_data['frequency']
                network['entity_type'] = entity_data['type']
                network['entity_description'] = entity_data.get('description', '')
                break

        deep_exploration.append(network)

    # 按複雜度分數排序，取前3個
    deep_exploration.sort(key=lambda x: x.get('complexity_score', 0), reverse=True)

    if not deep_exploration:
        return []

    # 定義顏色映射
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

    # 合併所有節點和邊
    all_nodes = []
    all_edges = []
    all_recommendations = []
    entity_id_map = {}  # 實體名稱到ID的映射
    current_node_id = 0
    current_edge_id = 1

    # 處理前3個最高複雜度的實體
    for rank, top_entity in enumerate(deep_exploration[:3], 1):
        # 合併所有關係並按 weight 排序
        all_relations = []

        # 處理出向關係
        for relation in top_entity['outgoing_connections']:
            all_relations.append({
                'type': 'outgoing',
                'related_entity': relation['target'],
                'description': relation['description'],
                'weight': relation['weight'],
                'direction': f"{top_entity['core_concept']} → {relation['target']}"
            })

        # 處理入向關係
        for relation in top_entity['incoming_connections']:
            all_relations.append({
                'type': 'incoming',
                'related_entity': relation['source'],
                'description': relation['description'],
                'weight': relation['weight'],
                'direction': f"{relation['source']} → {top_entity['core_concept']}"
            })

        # 按 weight 降序排序，取前5個
        all_relations.sort(key=lambda x: x['weight'], reverse=True)
        top_5_relations = all_relations[:5]

        if not top_5_relations:  # 如果沒有關係，跳過
            continue

        # 添加核心節點（如果還沒添加）
        core_concept = top_entity['core_concept']
        if core_concept not in entity_id_map:
            core_color = color_map.get(top_entity.get('entity_type', 'CONCEPT'), '#3B82F6')
            core_size = 150 - (rank - 1) * 20  # 排名越高，節點越大

            all_nodes.append({
                'id': current_node_id,
                'label': core_concept,
                'color': core_color,
                'size': core_size
            })

            entity_id_map[core_concept] = current_node_id
            current_node_id += 1

        # 收集所有相關實體
        related_entities = set()
        for relation in top_5_relations:
            related_entities.add(relation['related_entity'])

        # 為相關實體添加節點（如果還沒添加）
        for entity_name in related_entities:
            if entity_name not in entity_id_map:
                try:
                    entity = RagEntities.objects.get(task_id=task_id, title=entity_name)
                    entity_color = color_map.get(entity.type, '#64748b')

                    # 根據權重調整節點大小
                    if len(top_5_relations) > 1:
                        max_weight = max([r['weight'] for r in top_5_relations])
                        min_weight = min([r['weight'] for r in top_5_relations])

                        # 找到與此實體相關的最高權重
                        entity_max_weight = 0
                        for relation in top_5_relations:
                            if relation['related_entity'] == entity_name:
                                entity_max_weight = max(entity_max_weight, relation['weight'])

                        # 計算節點大小 (60-120 範圍)
                        if max_weight > min_weight:
                            size = 60 + (entity_max_weight - min_weight) / (max_weight - min_weight) * 60
                        else:
                            size = 90
                    else:
                        size = 90

                    all_nodes.append({
                        'id': current_node_id,
                        'label': entity_name,
                        'color': entity_color,
                        'size': int(size)
                    })

                except RagEntities.DoesNotExist:
                    # 如果找不到實體詳細信息，使用默認值
                    all_nodes.append({
                        'id': current_node_id,
                        'label': entity_name,
                        'color': '#64748b',
                        'size': 80
                    })

                entity_id_map[entity_name] = current_node_id
                current_node_id += 1

        # 添加邊
        for relation in top_5_relations:
            core_id = entity_id_map[core_concept]
            related_entity_id = entity_id_map.get(relation['related_entity'])

            if related_entity_id is not None:
                # 根據權重調整邊的寬度 (1-20 範圍)
                if len(top_5_relations) > 1:
                    max_weight = max([r['weight'] for r in top_5_relations])
                    min_weight = min([r['weight'] for r in top_5_relations])

                    if max_weight > min_weight:
                        width = 1 + (relation['weight'] - min_weight) / (max_weight - min_weight) * 19
                    else:
                        width = 10
                else:
                    width = 10

                if relation['type'] == 'outgoing':
                    from_id = core_id
                    to_id = related_entity_id
                else:  # incoming
                    from_id = related_entity_id
                    to_id = core_id

                all_edges.append({
                    'id': f'e{current_edge_id}',
                    'from': from_id,
                    'to': to_id,
                    'label': str(int(width)),  # 使用 width 作為 label
                    'color': '#64748b',
                    'width': int(width)
                })
                current_edge_id += 1

        # 保存推薦詳情
        recommendation_detail = {
            'rank': rank,
            'core_concept': top_entity['core_concept'],
            'complexity_score': top_entity['complexity_score'],
            'entity_degree': top_entity['entity_degree'],
            'entity_frequency': top_entity['entity_frequency'],
            'entity_description': top_entity['entity_description'],
            'total_connections': top_entity['total_connections'],
            'recommendation_reason': f"第{rank}名：複雜度分數 {top_entity['complexity_score']:.2f}，連接數 {top_entity['total_connections']}，頻率 {top_entity['entity_frequency']}",
            'relations_details': top_5_relations,
            'learning_priority': 'high' if rank == 1 else 'medium' if rank == 2 else 'normal'
        }
        all_recommendations.append(recommendation_detail)

    # 構建最終結果
    final_result = {
        'recommendation_type': 'deep_exploration',
        'total_recommendations': len(all_recommendations),
        'graph_data': {
            'nodes': all_nodes,
            'edges': all_edges
        },
        'recommendations_details': all_recommendations,
        'summary': f"找到 {len(all_recommendations)} 個高複雜度實體，共 {len(all_nodes)} 個節點，{len(all_edges)} 條關係"
    }

    return [final_result]  # 返回一個包含所有數據的推薦
