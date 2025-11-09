import os
import re
import subprocess

from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime

from backend.models import StudentTask, RagRelationships, RagEntities

client = OpenAI(api_key=os.getenv('OPENAI_KEY'))

SYSTEM_PROMPT = """
#zh-tw
The user may provide you with past messages in the following format: 過去的訊息內容：時間:{time}訊息:{message}*end*\n
You should only use these past messages as a reference to better understand the context of the user's question. Do not directly include or repeat the past messages in your response unless explicitly requested by the user.
You are an intelligent and helpful assistant dedicated to answering only questions related to the course content. 
You must not answer any question or provide information that is unrelated to the course.
When responding to the following prompt, 
please make sure to properly style your response using Github Flavored Markdown. 
Use markdown syntax for things like headings, lists, colored text, code blocks, highlights etc.
"""


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


def generate_next_steps_recommendations(entities_info, relationships_info):
    """
    生成下一步該怎麼做的建議
    基於當前實體的關係，推薦學習路徑
    """
    next_steps = []

    for entity_id, entity_data in entities_info.items():
        entity_title = entity_data['title']

        # 如果這個實體有關係
        if entity_title in relationships_info:
            relationships = relationships_info[entity_title]

            # 按權重排序，推薦最重要的下一步
            sorted_relationships = sorted(relationships, key=lambda x: x['weight'], reverse=True)

            for rel in sorted_relationships[:3]:  # 只取前3個最重要的
                next_steps.append({
                    'from_entity': entity_title,
                    'next_step': rel['target'],
                    'reason': rel['description'],
                    'importance': rel['weight'],
                    'recommendation_type': 'next_step'
                })

    # 按重要性排序
    next_steps.sort(key=lambda x: x['importance'], reverse=True)
    return next_steps[:5]  # 返回前5個建議


def generate_related_knowledge_recommendations(entities_info, task_id):
    """
    生成相關知識推薦
    基於實體的類型和頻率，找出相關的知識點
    """
    entity_titles = [data['title'] for data in entities_info.values()]

    # 找出與當前實體相關的其他實體（作為target出現）
    related_entities = RagRelationships.objects.filter(
        task_id=task_id,
        target__in=entity_titles
    ).values('source', 'target', 'description', 'weight').distinct()

    related_knowledge = []
    for rel in related_entities:
        # 獲取source實體的詳細資訊
        try:
            source_entity = RagEntities.objects.get(
                task_id=task_id,
                title=rel['source']
            )

            related_knowledge.append({
                'knowledge_point': rel['source'],
                'related_to': rel['target'],
                'connection': rel['description'],
                'entity_type': source_entity.type,
                'frequency': source_entity.frequency,
                'degree': source_entity.degree,
                'recommendation_type': 'related_knowledge'
            })
        except RagEntities.DoesNotExist:
            continue

    # 按頻率和度數排序
    related_knowledge.sort(key=lambda x: (x['frequency'], x['degree']), reverse=True)
    return related_knowledge[:8]  # 返回前8個相關知識


def generate_deep_exploration_recommendations(entities_info, task_id):
    """
    生成深入探討的知識推薦
    基於實體的度數和複雜關係，推薦深度學習內容
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
        complexity_score = network['total_connections'] * entities_info[entity_id]['frequency']
        network['complexity_score'] = complexity_score

        deep_exploration.append(network)

    # 按複雜度分數排序
    deep_exploration.sort(key=lambda x: x['complexity_score'], reverse=True)
    return deep_exploration[:5]  # 返回前5個深入探討建議


# OpenAI integrate
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def chat_with_amumamum(request):
    try:
        user_question = request.data.get('message')
        task_id = request.data.get('task_id')
        user_history_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).chat_history

        if user_history_data.chat_history is None:
            user_history_data.chat_history = []

        # 取前 4 則訊息當作回顧輸入
        user_history_stringify = ""
        for history in user_history_data.chat_history[-4:]:
            cleaned_message = re.sub(r'\s+', ' ', history['message']).strip()
            user_history_stringify += '過去的訊息內容：傳送人:{name}時間:{time}訊息:{message}\n'.format(
                name=history['name'] if history['name'] != 'Amun Amum' else 'OpenAI Assistant',
                time=history['time'],
                message=cleaned_message
            )
        user_content = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "name": request.user.name,
            "student_id": request.user.student_id,
            "message": user_question,
        }

        cmd = [
            "graphrag", "query",
            "--root", './graphrag',
            "--method", 'local',
            "--query", user_history_stringify + "本次的問題:" + user_question,
        ]

        print(user_history_stringify, user_question)
        result = subprocess.run(cmd, capture_output=True, text=True)
        output_text = result.stdout or result.stderr

        gpt_content = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "name": "Amum Amum",
            "student_id": "",
            "message": output_text,
        }

        user_history_data.chat_history.append(user_content)
        user_history_data.chat_history.append(gpt_content)
        user_history_data.save()

        return Response({'assistant': gpt_content}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'chat with amumamum Error: {e}')
        return Response({'chat with amumamum Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Specific function for graphRag recommendation
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def specific_chat_with_amumamum(request):
    try:
        user_question = request.data.get('message')
        task_id = request.data.get('task_id')
        function_type = request.data.get('function_type')  # 'next_step', 'similar', 'deep_learn'

        user_history_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).chat_history

        last_amum_message = None
        for message in reversed(user_history_data.chat_history):
            if message.get('name') == 'Amum Amum':
                last_amum_message = message
                break

        # 提取參考資料
        reference_data = extract_graphrag_references(last_amum_message['message'])

        # 根據類型分別獲取數據
        entities_data = None
        reports_data = None

        for ref in reference_data['all_references']:
            if ref['type'] == 'Entities':
                entities_data = ref
            elif ref['type'] == 'Reports':
                reports_data = ref

        # 如果有 entities 資料，進行處理
        recommendation_data = {}
        if entities_data and entities_data['numbers']:
            print(f"處理 Entities: {entities_data['numbers']}")

            # 1. 在 RagEntities 中搜尋這幾個點並提取其 title
            entities = RagEntities.objects.filter(
                task_id=task_id,
                human_readable_id__in=entities_data['numbers']
            ).values('human_readable_id', 'title', 'description', 'type', 'degree', 'frequency')

            entities_info = {}
            entity_titles = []
            for entity in entities:
                entities_info[entity['human_readable_id']] = {
                    'title': entity['title'],
                    'description': entity['description'],
                    'type': entity['type'],
                    'degree': entity['degree'],
                    'frequency': entity['frequency']
                }
                entity_titles.append(entity['title'])

            print(f"找到的 Entities: {entity_titles}")

            # 2. 在 RagRelationships 中搜尋 source 是 entities.title 的相關資料
            relationships = RagRelationships.objects.filter(
                task_id=task_id,
                source__in=entity_titles
            ).values('source', 'target', 'description', 'weight', 'human_readable_id')

            relationships_info = {}
            for rel in relationships:
                if rel['source'] not in relationships_info:
                    relationships_info[rel['source']] = []
                relationships_info[rel['source']].append({
                    'target': rel['target'],
                    'description': rel['description'],
                    'weight': rel['weight']
                })

            print(f"找到的 Relationships: {len(relationships)} 條關係")

            # 3. 根據 function_type 生成不同的推薦
            recommendations = {}

            if function_type == 'next_step':
                recommendations['next_steps'] = generate_next_steps_recommendations(entities_info, relationships_info)
            elif function_type == 'similar':
                recommendations['related_knowledge'] = generate_related_knowledge_recommendations(entities_info,
                                                                                                  task_id)
            elif function_type == 'deep_learn':
                recommendations['deep_exploration'] = generate_deep_exploration_recommendations(entities_info, task_id)
            else:
                # 如果沒有指定類型，返回所有推薦
                recommendations['next_steps'] = generate_next_steps_recommendations(entities_info, relationships_info)
                recommendations['related_knowledge'] = generate_related_knowledge_recommendations(entities_info,
                                                                                                  task_id)
                recommendations['deep_exploration'] = generate_deep_exploration_recommendations(entities_info, task_id)

            # 4. 整合資料
            recommendation_data = {
                'entities_info': entities_info,
                'relationships_info': relationships_info,
                'entity_titles': entity_titles,
                'total_relationships': len(relationships),
                'recommendations': recommendations
            }

        return Response({
            'assistant': user_history_data.chat_history[-1],
            'extracted_references': reference_data['all_references'],
            'entities': entities_data['numbers'] if entities_data else [],
            'reports': reports_data['numbers'] if reports_data else [],
            'recommendation_data': recommendation_data,
            'function_type': function_type
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'specify chat with amumamum Error: {e}')
        return Response({'specify chat with amumamum Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
