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

from backend.models import StudentTask, RagRelationships, RagEntities, StudentTaskProcessCode
from backend.utils.graphrag_utils import extract_graphrag_references, generate_next_step_graph
from backend.utils.recommendation_utils import (
    generate_related_knowledge_recommendations,
    generate_deep_exploration_recommendations
)

client = OpenAI(api_key=os.getenv('OPENAI_KEY'))

CODE_DEBUG_ASSISTANT_ID = os.getenv('CODE_DEBUG_ASSISTANT_ID')
AI_NAME = "Amum Amum"


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
                name=history['name'] if history['name'] != AI_NAME else 'OpenAI Assistant',
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

        result = subprocess.run(cmd, capture_output=True, text=True)
        output_text = result.stdout or result.stderr

        gpt_content = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "name": AI_NAME,
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


@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def code_debug_with_amumamum(request):
    try:
        user_question = request.data.get('message')
        task_id = request.data.get('task_id')
        student_task = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id)
        user_process_code = student_task.process.process_code
        user_history_data = student_task.chat_history

        html_code = user_process_code.html_code or ""
        css_code = user_process_code.css_code or ""
        js_code = user_process_code.js_code or ""

        # 檢查是否有 thread_id，如果沒有則創建新的 thread
        thread_id = user_process_code.assistant_thread_id
        if not thread_id:
            # 創建新的 thread
            thread = client.beta.threads.create()
            thread_id = thread.id
            # 保存 thread_id
            user_process_code.assistant_thread_id = thread_id
            user_process_code.save()

        # 構建提示訊息
        prompt_message = f"""
                請幫我解決以下程式碼問題：

                問題描述：{user_question}

                HTML 代碼：
                ```html
                {html_code}
                ```

                CSS 代碼：
                ```css
                {css_code}
                ```

                JavaScript 代碼：
                ```javascript
                {js_code}
                ```

                請提供詳細的解釋和解決方案。
                """

        # 將用戶問題添加到 thread
        message = client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=prompt_message
        )

        # 運行助手
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=CODE_DEBUG_ASSISTANT_ID
        )

        # 等待運行完成
        import time
        max_retries = 30  # 最多等待30秒
        retry_count = 0

        while True:
            if retry_count >= max_retries:
                return Response({'error': 'Assistant response timeout'}, status=status.HTTP_504_GATEWAY_TIMEOUT)

            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )

            if run_status.status == 'completed':
                break
            elif run_status.status in ['failed', 'cancelled', 'expired']:
                return Response(
                    {'error': f'Assistant run failed with status: {run_status.status}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # 短暫等待後再檢查狀態
            time.sleep(1)
            retry_count += 1

        # 獲取助手的回應
        messages = client.beta.threads.messages.list(
            thread_id=thread_id
        )

        # 獲取最新的助手回應
        assistant_message = None
        for msg in messages.data:
            if msg.role == "assistant":
                assistant_message = msg
                break

        if assistant_message:
            # 提取文本內容
            response_text = ""
            for content_item in assistant_message.content:
                if content_item.type == "text":
                    response_text += content_item.text.value

            # 創建用戶消息和助手回應內容
            user_content = {
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "name": request.user.name,
                "student_id": request.user.student_id,
                "message": user_question,
            }
            gpt_content = {
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "name": AI_NAME,
                "student_id": "",
                "message": response_text,
            }

            # 更新聊天歷史
            user_history_data.chat_history.append(user_content)
            user_history_data.chat_history.append(gpt_content)
            user_history_data.save()

            return Response({'assistant': gpt_content}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No assistant response received'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        print(f'code debug with amumamum Error: {e}')
        import traceback
        traceback.print_exc()
        return Response({'code debug with amumamum Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Specific function for graphRag recommendation
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def specific_chat_with_amumamum(request):
    try:
        find_prev = request.data.get('find_prev', False)
        task_id = request.data.get('task_id')
        function_type = request.data.get('function_type')  # 'next_step', 'similar', 'deep_learn'

        user_history_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).chat_history

        last_amum_message = None
        for message in reversed(user_history_data.chat_history):
            if message.get('name') == AI_NAME:
                if find_prev:
                    find_prev = False
                    continue

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
                # 直接使用新函數生成圖形格式的推薦
                recommendations['next_step'] = generate_next_step_graph(entities_info, task_id)
            elif function_type == 'similar':
                recommendations['related_knowledge'] = generate_related_knowledge_recommendations(entities_info,
                                                                                                  task_id)
            elif function_type == 'deep_learn':
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
            'extracted_references': reference_data['all_references'],
            'entities': entities_data['numbers'] if entities_data else [],
            'reports': reports_data['numbers'] if reports_data else [],
            'recommendation_data': recommendation_data,
            'function_type': function_type
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'specify chat with amumamum Error: {e}')
        return Response({'specify chat with amumamum Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
