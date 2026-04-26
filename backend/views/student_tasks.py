from django.db.models.expressions import result
import os
import json
from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction

from backend.models import Task, StudentTask, User, StudentTaskPlan, StudentTaskProcess, \
    StudentTaskProcessCode, StudentTaskReflection, Feedback, ClassName, ChatHistory

from backend.utils.common_utils import transfer_key_to_values

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""
client = OpenAI(api_key=os.getenv('OPENAI_KEY'))


def serialize_task_process_hint_data(student_data, question_list):
    serialized_data = []
    for process_index, process in enumerate(student_data):
        serialized_data.append(f'階段{process_index}')
        for data_index, data in enumerate(process):
            serialized_data.append(f'引導問題:{question_list[process_index][data_index].get("title")}')
            serialized_data.append(f'學生回覆:{data}')

    return "\n".join(serialized_data)


def serialize_task_reflection_and_plan_data(student_data, question_list, type_name):
    serialized_data = []
    if not student_data or not question_list:
        serialized_data = '無資料'
    else:
        for process_index, process in enumerate(student_data):
            serialized_data.append(f'階段{process_index}')
            for data_index, data in enumerate(process):
                serialized_data.append(f'{type_name}:{question_list[process_index][data_index].get("title")}')
                if not data:
                    serialized_data.append('學生回覆:無資料')
                elif isinstance(data, dict):
                    serialized_data.append(f'學生回覆:{data.get("reflect")}')
                else:
                    for plan_index, plan_detail in enumerate(data):  # 將字典內容格式化為字串
                        detail_str = f'程序{str(plan_index + 1)}:\n' + '\n'.join(
                            f'{transfer_key_to_values(key)}: {transfer_key_to_values(value)}' for key, value in
                            plan_detail.items())
                        serialized_data.append(detail_str)
                serialized_data.append('')
    return "\n".join(serialized_data)


def serialize_student_task_data(student_task):
    """
    處理學生每一筆 StudentTask 中的資料集
    :param student_task:
    :return:
    """
    student_info = student_task.student
    task_name = student_task.task.name
    sub_target_list = student_task.task.target.sub_target_list
    student_plan_data = student_task.plan
    student_plan = serialize_task_reflection_and_plan_data(student_plan_data.plan_list, sub_target_list, '子目標')

    student_process = student_task.process
    process_hint_question = [] if not student_task.task.process_hint.hints else student_task.task.process_hint.hints
    student_hint_reply = serialize_task_process_hint_data(student_process.process_hint_reply, process_hint_question)
    student_code = student_process.process_code

    student_reflection = student_task.reflection
    reflection_question = student_task.task.reflection_question
    student_reflects = serialize_task_reflection_and_plan_data(student_reflection.reflects,
                                                               reflection_question.questions, '反思題目')
    student_feedback = student_task.feedback

    return {
        '課程名稱': task_name,
        '學生組別': student_info.student_group.group_type,
        '計劃內容': student_plan,
        '程式碼_HTML': str(getattr(student_code, 'html_code', '無HTML程式碼')),
        '程式碼_CSS': str(getattr(student_code, 'css_code', '無HTML程式碼')),
        '程式碼_JS': str(getattr(student_code, 'js_code', '無JS程式碼')),
        '實作提示反饋': str(student_hint_reply),
        '反思內容': str(student_reflects),
        "自我評分": str(student_reflection.self_scoring),
        '選擇項目': str(getattr(student_plan_data, 'select_sub_list', '未選擇')),
        '完成項目': str(getattr(student_reflection, 'completed_targets', '尚未完成')),
        '反饋內容': str(getattr(student_feedback, 'teacher_feedback', '無系統回饋'))
    }


def serialize_student_tasks_data(student_tasks):
    """
    處理單一學生多筆 StudentTask 資料
    :param student_tasks:
    :return:
    """
    serialized_data = []
    for student_task in student_tasks:
        serialized_data.append(serialize_student_task_data(student_task))
    return serialized_data


def serialize_multi_student_task_data(student_tasks):
    """
    處理多位學生並放置在同一資料表中
    :param student_tasks:
    :return:
    """
    student_id_list = []
    student_data_list = []
    for student_task in student_tasks:
        student_id = student_task.student.student_id
        serialized_data = serialize_student_task_data(student_task)
        if student_id not in student_id_list:
            student_id_list.append(student_id)
            student_data_list.append([serialized_data])
        else:
            # 將資料加入對應的 student_data_list 中
            index = student_id_list.index(student_id)
            student_data_list[index].append(serialized_data)

    return student_id_list, student_data_list


# init Student Task
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def init_student_task(request):
    try:
        task_id = request.data.get('task_id')
        student_task_data = StudentTask.objects.filter(student_id=request.user.student_id, task_id=task_id).first()
        if student_task_data is None:
            with transaction.atomic():
                student = User.objects.get(student_id=request.user.student_id)
                task_data = Task.objects.get(id=task_id)
                class_name = request.user.class_name

                plan = StudentTaskPlan.objects.create()
                process_code = StudentTaskProcessCode.objects.create()
                process = StudentTaskProcess.objects.create(
                    process_code=process_code,
                )
                reflection = StudentTaskReflection.objects.create()
                feedback = Feedback.objects.create()
                chat_history = ChatHistory.objects.create()

                StudentTask.objects.create(
                    student=student,
                    class_name=class_name,
                    task=task_data,
                    plan=plan,
                    process=process,
                    reflection=reflection,
                    feedback=feedback,
                    chat_history=chat_history,
                )
            return Response({'status': 'Initialized'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Created'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'init student task Error: {e}')
        return Response({'init student task Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get Student task by student id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_by_student_id(request):
    try:
        student_id = request.data.get('student_id')

        student_tasks_data = StudentTask.objects.filter(student_id=student_id)
        if student_tasks_data is None:
            return Response({'student task does not exist'}, status=status.HTTP_404_NOT_FOUND)

        result_data = serialize_student_tasks_data(student_tasks_data)
        return Response({'student_task_content': result_data}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by student id Error: {e}')
        return Response({'get student task by student id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student task by class
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_by_class_name(request):
    try:
        class_name = request.data.get('class_name')
        class_id = ClassName.objects.get(name=class_name).id

        student_tasks_data = StudentTask.objects.filter(class_name_id=class_id)
        student_id_list, student_data_list = serialize_multi_student_task_data(student_tasks_data)
        return Response({'student_data_list': student_data_list, 'student_id_list': student_id_list},
                        status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by class name Error: {e}')
        return Response({'get student task by class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student tasks by class ids
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_by_class_ids(request):
    try:
        class_ids = request.data.get('class_ids')

        if not class_ids or not isinstance(class_ids, list):
            return Response({'error': 'class_ids must be a non-empty list'}, status=status.HTTP_400_BAD_REQUEST)

        # 獲取所有指定班級ID的學生任務數據
        student_tasks_data = StudentTask.objects.filter(class_name_id__in=class_ids)

        if not student_tasks_data.exists():
            return Response({'message': 'No student tasks found for the specified class IDs'},
                            status=status.HTTP_204_NO_CONTENT)

        # 序列化數據
        student_id_list, student_data_list = serialize_multi_student_task_data(student_tasks_data)

        return Response({
            'student_data_list': student_data_list,
            'student_id_list': student_id_list
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by class ids Error: {e}')
        return Response({'get student task by class ids Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student tasks by task id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_tasks_by_task_id(request):
    try:
        task_id = request.data.get('task_id')
        student_tasks_data = StudentTask.objects.filter(task_id=task_id)
        student_id_list, student_data_list = serialize_multi_student_task_data(student_tasks_data)
        return Response({'student_data_list': student_data_list, 'student_id_list': student_id_list},
                        status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by class name Error: {e}')
        return Response({'get student task by class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get all student task
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_student_task(request):
    try:
        student_tasks_data = StudentTask.objects.all()
        student_id_list, student_data_list = serialize_multi_student_task_data(student_tasks_data)
        return Response({'student_data_list': student_data_list, 'student_id_list': student_id_list},
                        status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by student id Error: {e}')
        return Response({'get student task by student id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get all student chat analysis by class name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_all_student_chat_analysis_by_class_name(request):
    try:
        class_name = request.data.get('class_name')
        class_id = ClassName.objects.get(name=class_name).id

        student_tasks_data = StudentTask.objects.filter(class_name_id=class_id)

        for student_task in student_tasks_data:
            student_id = student_task.student.student_id
            chat_history_obj = student_task.chat_history
            if not chat_history_obj or not hasattr(chat_history_obj,
                                                   'chat_history') or not chat_history_obj.chat_history:
                continue

            chat_histories = chat_history_obj.chat_history

            student_messages = []
            message_indices = []
            for i, chat_history in enumerate(chat_histories):
                has_chat_type = 'chat_type' in chat_history and chat_history['chat_type']
                if chat_history['name'] != 'Amum Amum' and not has_chat_type:
                    student_messages.append(chat_history['message'])
                    message_indices.append(i)

            if student_messages:
                prompt = f"以下是學生ID {student_id} 的聊天記錄，請分析每條訊息的類型，並以指定的JSON格式返回分析結果。\n\n"

                for i, msg in enumerate(student_messages):
                    prompt += f"訊息 {message_indices[i]}: {msg}\n"

                prompt += "\n請將分析結果以下列JSON格式返回，每條訊息的類型必須是以下之一：'詢問方向', '詢問語法', '詢問偵錯', '詢問解釋', '詢問下一步', '其他'。\n"
                prompt += "例如：[{\"index\":1, \"type\":\"詢問方向\"}, {\"index\":2, \"type\":\"詢問語法\"}]\n"
                prompt += ""

                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system",
                         "content": "你是一個教育分析專家，專門分析學生的聊天訊息。你需要準確分類每條訊息的類型，並嚴格按照要求的格式返回結果，除 JSON 內容外，不要回應其他內容在裡面。"},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000)

                try:
                    response_content = response.choices[0].message.content
                    # 嘗試找到並提取 JSON 部分
                    json_start = response_content.find('[')
                    json_end = response_content.rfind(']') + 1

                    if 0 <= json_start < json_end:
                        json_str = response_content[json_start:json_end]
                        message_types = json.loads(json_str)
                    else:
                        # 如果找不到有效的 JSON 數組標記，嘗試清理回應內容
                        cleaned_content = response_content.strip()
                        if cleaned_content.startswith('```json'):
                            cleaned_content = cleaned_content.replace('```json', '', 1)
                        if cleaned_content.endswith('```'):
                            cleaned_content = cleaned_content.rsplit('```', 1)[0]
                        cleaned_content = cleaned_content.strip()
                        message_types = json.loads(cleaned_content)

                    # 直接使用返回的索引更新聊天記錄
                    for item in message_types:
                        index = item.get("index")
                        msg_type = item.get("type")

                        # 確保索引有效
                        if isinstance(index, int) and 0 <= index < len(chat_histories) and msg_type:
                            if 'chat_type' not in chat_histories[index]:
                                chat_histories[index]['chat_type'] = ""
                            chat_histories[index]['chat_type'] = msg_type

                    # 保存更新後的聊天歷史
                    chat_history_obj.save()

                except Exception as e:
                    print(f"Error processing OpenAI response for student {student_id}: {e}")

        # 整理所有學生的聊天記錄為表格格式
        excel_formatted_data = []
        # 重新查詢獲取最新的數據
        updated_student_tasks = StudentTask.objects.filter(class_name_id=class_id)

        for student_task in updated_student_tasks:
            student_id = student_task.student.student_id
            student_name = student_task.student.name
            chat_history_obj = student_task.chat_history

            if chat_history_obj and hasattr(chat_history_obj, 'chat_history') and chat_history_obj.chat_history:
                chat_histories = chat_history_obj.chat_history

                for i, chat in enumerate(chat_histories):
                    # 只處理學生的訊息
                    if chat['name'] != 'Amum Amum':
                        excel_formatted_data.append({
                            '學生ID': student_id,
                            '學生姓名': student_name,
                            '訊息內容': chat['message'],
                            '訊息類型': chat.get('chat_type', '未分類'),
                            '時間戳': chat.get('time', '')
                        })

        # 另外計算每個學生各類型訊息的統計
        student_stats = {}
        message_type_list = ['詢問方向', '詢問語法', '詢問偵錯', '詢問解釋', '詢問下一步', '其他', '未分類']

        for student_task in updated_student_tasks:
            student_id = student_task.student.student_id
            student_name = student_task.student.name
            chat_history_obj = student_task.chat_history

            if not chat_history_obj or not hasattr(chat_history_obj,
                                                   'chat_history') or not chat_history_obj.chat_history:
                continue

            # 初始化統計
            stats = {msg_type: 0 for msg_type in message_type_list}

            # 計算各類型訊息數量
            for chat in chat_history_obj.chat_history:
                if chat['name'] != 'Amum Amum':
                    msg_type = chat.get('chat_type', '未分類')
                    if msg_type in stats:
                        stats[msg_type] += 1
                    else:
                        stats['其他'] += 1

            # 計算學生總訊息數
            total_messages = sum(stats.values())
            stats['總訊息數'] = total_messages

            student_stats[student_id] = {
                '學生ID': student_id,
                '學生姓名': student_name,
                **stats
            }

        return Response({
            'student_chat_analysis': excel_formatted_data,
            'student_statistics': list(student_stats.values())
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get student task by student id Error: {e}')
        return Response({'get student task by student id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
