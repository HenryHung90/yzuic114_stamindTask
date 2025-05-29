from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime, timedelta

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


# get Chat Histories
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_histories_by_student_id(request):
    try:
        student_id = request.data.get('student_id')

        chat_history_data = User.objects.get(student_id=student_id).chat_history

        if chat_history_data is None or chat_history_data is []:
            return Response({'messages': 'empty'}, status=status.HTTP_204_NO_CONTENT)
        else:
            chat_history_data = chat_history_data.chat_history

        res_messages = []
        for history in chat_history_data:
            modify_message = {
                "使用者名稱": history["name"],
                "學生ID": history["student_id"],
                "發送時間": history["time"],
                "傳送訊息": history["message"],
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

        # 算出所有天數以及每天的詢問次數
        all_time_stamp = []
        for student_task in student_task_data:
            chat_data = student_task.chat_history.chat_history
            for message in chat_data:
                if message.get('name') == 'Amum Amum':
                    all_time_stamp.append(message.get('time')[:10])  # 取年月日
        # 生成所有天的列表
        day_list = generate_all_days_time_stamp(all_time_stamp)
        ask_times_list = count_occurrences_by_day(day_list, all_time_stamp)

        # 算出學生每天的詢問次數
        # x: 時間, y: 姓名, v: 次數
        student_ask_list = []
        student_list = []
        for student_task in student_task_data:
            student_time_stamp = []
            student_id = student_task.student.student_id
            student_name = student_task.student.name
            chat_data = student_task.chat_history.chat_history

            student_list.append(student_id + student_name)
            for message in chat_data:
                if message.get('name') == 'Amum Amum':
                    student_time_stamp.append(message.get('time')[:10])  # 取年月日

            count_list = count_occurrences_by_day(day_list, student_time_stamp)
            for idx, day in enumerate(day_list):
                student_ask_list.append({
                    'x': day,
                    'y': student_id + student_name,
                    'v': count_list[idx]
                })
        return Response({
            'day_list': day_list,
            'ask_times_list': ask_times_list,
            'student_ask_list': student_ask_list,
            'student_list': sorted(student_list)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get Chat AI heat map by task id Error: {e}')
        return Response({'get Chat AI heat map by task id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
