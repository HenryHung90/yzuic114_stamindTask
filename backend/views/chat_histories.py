from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime, timedelta

from stopwordsiso import stopwords as sw
import jieba
import re
from collections import Counter

from backend.models import User, StudentTask, ChatHistory


# 生成該 stamp 從開始到結束日期的所有小時
def generate_all_hours_time_stamp(time_stamp):
    sorted_time_stamp = sorted(time_stamp)
    start_dt = datetime.strptime(sorted_time_stamp[0], '%Y-%m-%d %H')
    end_dt = datetime.strptime(sorted_time_stamp[-1], '%Y-%m-%d %H') + timedelta(hours=1)
    # 生成所有小時的列表
    all_hours = []
    current_dt = start_dt
    while current_dt <= end_dt:
        all_hours.append(current_dt.strftime('%Y-%m-%d %H'))
        current_dt += timedelta(hours=1)
    return all_hours


# 生成該 stamp 從開始到結束日期的所有天數
def generate_all_days_time_stamp(time_stamp):
    sorted_time_stamp = sorted(time_stamp)
    start_dt = datetime.strptime(sorted_time_stamp[0], '%Y-%m-%d')
    end_dt = datetime.strptime(sorted_time_stamp[-1], '%Y-%m-%d') + timedelta(days=1)
    # 生成所有小時的列表
    all_hours = []
    current_dt = start_dt
    while current_dt <= end_dt:
        all_hours.append(current_dt.strftime('%Y-%m-%d'))
        current_dt += timedelta(days=1)
    return all_hours


# 計算每天在時間戳列表中出現的次數
def count_occurrences_by_day(day_list, time_stamp_list):
    """
    計算每天在時間戳列表中出現的次數

    參數:
    day_list (list): 所有日期的列表，格式為 'YYYY-MM-DD'
    time_stamp_list (list): 所有時間戳的列表

    返回:
    list: 與 day_list 長度相同的列表，表示每天出現的次數
    """
    count_list = [0] * len(day_list)
    time_stamp_dates = [ts[:10] for ts in time_stamp_list]
    for i, day in enumerate(day_list):
        count_list[i] = time_stamp_dates.count(day)

    return count_list


# 從學生任務數據中收集所有時間戳
def collect_time_stamps_from_tasks(student_task_data):
    """
    從學生任務數據中收集所有時間戳

    參數:
    student_task_data: 學生任務數據查詢集

    返回:
    list: 所有收集到的時間戳列表
    """
    all_time_stamp = []
    for student_task in student_task_data:
        # 檢查 chat_history 是否存在
        if not student_task.chat_history:
            continue
        chat_data = student_task.chat_history.chat_history
        # 檢查 chat_history.chat_history 是否為有效列表
        if not chat_data or not isinstance(chat_data, list):
            continue

        for message in chat_data:
            if message.get('name') == 'Amum Amum' and message.get('time'):
                all_time_stamp.append(message.get('time')[:10])  # 取年月日

    return all_time_stamp


# 生成熱力圖數據
def generate_heat_map_data(student_task_data, day_list, include_class_name=False):
    """
    生成熱力圖數據

    參數:
    student_task_data: 學生任務數據查詢集
    day_list: 所有日期列表
    include_class_name: 是否在學生標識符中包含班級名稱

    返回:
    tuple: (student_ask_list, student_list) 學生詢問數據列表和學生列表
    """
    student_ask_list = []
    student_list = []

    for student_task in student_task_data:
        # 檢查學生和聊天歷史是否存在
        if not student_task.student or not student_task.chat_history:
            continue

        student_time_stamp = []
        student_id = student_task.student.student_id or ""
        student_name = student_task.student.name or ""

        # 構建學生標識符
        if include_class_name:
            class_name = student_task.class_name.name if student_task.class_name else "未知班級"
            student_identifier = f"{student_id}_{student_name}({class_name})"
        else:
            student_identifier = f"{student_id}{student_name}"

        if not student_id.strip() or not student_name.strip():
            continue

        chat_data = student_task.chat_history.chat_history
        # 檢查 chat_history.chat_history 是否為有效列表
        if not chat_data or not isinstance(chat_data, list):
            continue

        student_list.append(student_identifier)
        for message in chat_data:
            if message.get('name') == 'Amum Amum' and message.get('time'):
                student_time_stamp.append(message.get('time')[:10])  # 取年月日

        count_list = count_occurrences_by_day(day_list, student_time_stamp)
        for idx, day in enumerate(day_list):
            student_ask_list.append({
                'x': day,
                'y': student_identifier,
                'v': count_list[idx]
            })

    return student_ask_list, student_list


# 處理熱力圖數據並返回響應
def process_heat_map_data(student_task_data, include_class_name=False):
    """
    處理熱力圖數據並返回響應

    參數:
    student_task_data: 學生任務數據查詢集
    include_class_name: 是否在學生標識符中包含班級名稱

    返回:
    Response: Django REST framework 響應對象
    """
    # 收集所有時間戳
    all_time_stamp = collect_time_stamps_from_tasks(student_task_data)

    # 檢查是否有收集到時間戳記
    if not all_time_stamp:
        return Response({
            'day_list': [],
            'ask_times_list': [],
            'student_ask_list': [],
            'student_list': []
        }, status=status.HTTP_200_OK)

    # 生成所有天的列表
    day_list = generate_all_days_time_stamp(all_time_stamp)
    ask_times_list = count_occurrences_by_day(day_list, all_time_stamp)

    # 生成熱力圖數據
    student_ask_list, student_list = generate_heat_map_data(student_task_data, day_list, include_class_name)

    # 返回響應
    return Response({
        'day_list': day_list,
        'ask_times_list': ask_times_list,
        'student_ask_list': student_ask_list,
        'student_list': sorted(student_list) if student_list else []
    }, status=status.HTTP_200_OK)


# 分析文本並生成詞雲數據
def analyze_text_for_word_cloud(text_list):
    """
    分析文本並生成詞雲數據

    參數:
    text_list (list): 包含文本的列表

    返回:
    list: 詞雲數據，格式為 [{"text": word, "value": count}, ...]
    """
    try:
        # 獲取中文和英文停用詞
        zh_stopwords = sw('zh')
        en_stopwords = sw('en')
        # 合併停用詞
        stopwords = list(zh_stopwords) + list(en_stopwords)

        # 合併所有文本
        all_text = ' '.join(text_list)

        # 使用結巴分詞
        jieba.initialize()  # 確保結巴已初始化
        words = jieba.cut(all_text)

        # 過濾停用詞和單字符詞
        filtered_words = [
            word for word in words
            if word.lower() not in stopwords
               and len(word.strip()) > 1
               and not re.match(r'^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?%?$', word)  # 過濾純數字
        ]

        word_counter = Counter(filtered_words)
        common_words = word_counter.most_common(500)
        return [{"text": word, "value": count} for word, count in common_words]

    except Exception as e:
        print(f'Word frequency analysis error: {e}')
        return []


# get Chat Histories
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_histories(request):
    try:
        offset = request.data.get('offset')
        task_id = request.data.get('task_id')

        student_task_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id)
        chat_history_data = student_task_data.chat_history

        if chat_history_data is None or chat_history_data is []:
            student_task_data.chat_history = ChatHistory.objects.create()
            student_task_data.save()
            return Response({'messages': 'empty'}, status=status.HTTP_200_OK)
        else:
            chat_history_data = chat_history_data.chat_history

        if offset > len(chat_history_data):
            return Response({'messages': 'empty'}, status=status.HTTP_200_OK)

        start = max(-len(chat_history_data), -offset - 10)  # 保證不超出範圍
        end = -offset if offset <= len(chat_history_data) else None  # 如果 offset 超出範圍，取到最後
        offset_data = chat_history_data[start:end] if end != 0 else chat_history_data[-10:]

        res_messages = []
        for history in offset_data:
            modify_message = {
                "time": history.get("time"),
                "message": history.get("message"),
                "studentId": history.get("student_id"),
                "name": history.get("name"),
            }
            res_messages.append(modify_message)

        return Response({'messages': res_messages}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get Chat Histories Error: {e}')
        return Response({'get Chat Histories Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get all chat histories sorted by time
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_chat_histories(request):
    try:
        # 獲取所有聊天歷史記錄
        chat_histories = ChatHistory.objects.all()

        # 準備結果列表
        all_messages = []

        # 遍歷每個聊天歷史對象
        for chat_history in chat_histories:
            # 檢查 chat_history 是否存在
            if not chat_history or not chat_history.chat_history:
                continue

            # 遍歷聊天歷史中的每條消息
            for message_json in chat_history.chat_history:
                # 檢查消息格式是否正確
                if not isinstance(message_json, dict):
                    # 嘗試解析可能是字符串格式的 JSON
                    try:
                        import json
                        message = json.loads(message_json)
                        if not isinstance(message, dict) or 'time' not in message:
                            continue
                    except:
                        continue
                else:
                    message = message_json
                # 創建新的消息對象，包含學生和班級信息
                name = message.get("name", "未知")
                if name != 'Amum Amum':
                    message_data = {
                        "使用者名稱": message.get("name", "未知"),
                        "發送時間": message.get("time", ""),
                        "傳送訊息": message.get("message", ""),
                    }
                    all_messages.append(message_data)

        # 按發送時間排序
        sorted_messages = sorted(all_messages, key=lambda x: x["發送時間"])

        return Response({
            'chat_histories_list': sorted_messages,
            'total_count': len(sorted_messages)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get All Chat Histories Error: {e}')
        return Response({'get All Chat Histories Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_all_chat_histories_by_class_ids(request):
    try:
        class_ids = request.data.get('class_ids', [])

        student_tasks = StudentTask.objects.filter(class_name_id__in=class_ids).select_related('chat_history')

        all_messages = []

        # 遍歷每個聊天歷史對象
        for student_task in student_tasks:
            # 檢查 chat_history 是否存在
            if not student_task or not student_task.chat_history:
                continue

            # 遍歷聊天歷史中的每條消息
            for message_json in student_task.chat_history.chat_history:
                # 檢查消息格式是否正確
                if not isinstance(message_json, dict):
                    # 嘗試解析可能是字符串格式的 JSON
                    try:
                        import json
                        message = json.loads(message_json)
                        if not isinstance(message, dict) or 'time' not in message:
                            continue
                    except:
                        continue
                else:
                    message = message_json
                # 創建新的消息對象，包含學生和班級信息
                name = message.get("name", "未知")
                if name != 'Amum Amum':
                    all_messages.append(message.get("message", ""))

        word_cloud_data = analyze_text_for_word_cloud([msg for msg in all_messages])

        return Response({
            'total_count': len(all_messages),
            'words': word_cloud_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get Chat Histories By Class IDs Error: {e}')
        return Response({'get Chat Histories By Class IDs Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get Chat Histories
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_histories_by_student_id(request):
    try:
        student_id = request.data.get('student_id')
        student_tasks = StudentTask.objects.filter(student_id=student_id).select_related('chat_history').select_related(
            'task')

        student_info_data_list = [{'chat_history': student_task.chat_history, 'task_name': student_task.task.name}
                                  for student_task in student_tasks]

        if not student_info_data_list:
            return Response({'messages': 'empty'}, status=status.HTTP_204_NO_CONTENT)

        res_messages = []
        for student_data in student_info_data_list:
            messages = student_data['chat_history']
            task_name = student_data["task_name"]

            if not messages: continue

            for message in messages.chat_history:
                modify_message = {
                    "使用者名稱": message.get("name", ""),
                    "課程名稱": task_name,
                    "學生ID": message.get("student_id", ""),
                    "發送時間": message.get("time", ""),
                    "傳送訊息": message.get("message", ""),
                }
                res_messages.append(modify_message)

        return Response({'chat_history': res_messages}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get Chat Histories by Student Id Error: {e}')
        return Response({'get Chat Histories by Student Id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get chat AI heat map by task id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_ai_heat_map_by_task_id(request):
    try:
        task_id = request.data.get('task_id')
        student_task_data = StudentTask.objects.filter(task_id=task_id)

        return process_heat_map_data(student_task_data, include_class_name=False)
    except Exception as e:
        print(f'get Chat AI heat map by task id Error: {e}')
        return Response({'get Chat AI heat map by task id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get chat AI heat map by class ids
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_ai_heat_map_by_class_ids(request):
    try:
        class_ids = request.data.get('class_ids')

        if not class_ids or not isinstance(class_ids, list):
            return Response({'error': 'class_ids must be a non-empty list'}, status=status.HTTP_400_BAD_REQUEST)

        # 獲取所有指定班級的學生任務數據
        student_task_data = StudentTask.objects.filter(class_name_id__in=class_ids)

        return process_heat_map_data(student_task_data, include_class_name=True)
    except Exception as e:
        print(f'get Chat AI heat map by class ids Error: {e}')
        return Response({'get Chat AI heat map by class ids Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
