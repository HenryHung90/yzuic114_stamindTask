import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import ClassName, StudentRecord, User, StudentTask, Task

from ..utils import calculate_box_plot_data

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def serialize_record_data(record):
    return {
        '學號': record.user_id,
        '動作': record.verb,
        '物件類別': record.object_type,
        '物件名稱': record.object_name,
        '物件識別ID': record.object_id,
        '發生時間': record.time,
        '計時器': record.timer,
        '詳細描述': record.context.get('description'),
        '裝置資訊': str(record.context.get('device')),
    }


def serialize_records_data(student_record_set):
    serialized_data = []
    for record in student_record_set:
        record_data = serialize_record_data(record)

        serialized_data.append(record_data)
    return serialized_data


def serialize_multi_student_record_data(student_record_set):
    """
    處理多位學生並放置在同一資料表中
    :param student_record_set:
    :return:
    """
    student_id_list = []
    student_data_list = []

    for record in student_record_set:
        student_id = record.user_id
        serialized_data = serialize_record_data(record)

        if student_id not in student_id_list:
            student_id_list.append(student_id)
            student_data_list.append([serialized_data])
        else:
            # 將資料加入對應的 student_data_list 中
            index = student_id_list.index(student_id)
            student_data_list[index].append(serialized_data)

    return student_id_list, student_data_list


def calculate_student_records_info(student_record_set, group_info):
    # 兩個組別各有六階段，每一階段皆需算出箱型圖的 min, q1, median, q3, max
    # 因此每一組的每一階段皆需算出其各自的箱型圖數據
    empty_array = [0] * 6
    calculate_data = {
        'EXPERIMENTAL': {
            "min": empty_array.copy(),
            "q1": empty_array.copy(),
            "median": empty_array.copy(),
            "means": empty_array.copy(),
            "q3": empty_array.copy(),
            "max": empty_array.copy(),
        },
        'CONTROL': {
            "min": empty_array.copy(),
            "q1": empty_array.copy(),
            "median": empty_array.copy(),
            "means": empty_array.copy(),
            "q3": empty_array.copy(),
            "max": empty_array.copy()
        }
    }

    experimental_data = {
        'Experience': [],
        'Target': [],
        'Plan': [],
        'Process': [],
        'Reflection': [],
        'Feedback': []
    }
    control_data = {
        'Experience': [],
        'Target': [],
        'Plan': [],
        'Process': [],
        'Reflection': [],
        'Feedback': []
    }

    # 整理兩組數據
    for student_record in student_record_set:
        target = student_record.user_id
        group_type = group_info.get(target)
        progress_target = student_record.object_id.split("leave")[1]
        timer = round(int(student_record.timer) / 60, 2)

        if group_type is None:
            continue
        elif group_type == 'EXPERIMENTAL':
            experimental_data[progress_target].append(timer)
        else:
            control_data[progress_target].append(timer)

    # 計算各階段的 min, q1, median, q3, max
    progress_types = ['Experience', 'Target', 'Plan', 'Process', 'Reflection', 'Feedback']
    for i, progress in enumerate(progress_types):
        experimental_result = calculate_box_plot_data(experimental_data[progress])
        control_result = calculate_box_plot_data(control_data[progress])

        for stat in ['min', 'q1', 'median', 'means', 'q3', 'max']:
            calculate_data['EXPERIMENTAL'][stat][i] = experimental_result[stat]
            calculate_data['CONTROL'][stat][i] = control_result[stat]

    return calculate_data


# save student note
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_student_records(request):
    try:
        user = request.user
        student_records = request.data.get('student_records')
        class_name = ClassName.objects.get(name=user.class_name)

        records_to_create = []
        errors = []
        # 處理每一筆記錄(若為 str 表示從 Beacon 寄送，需轉為 json)
        if type(student_records) == str:
            student_records = json.loads(student_records)

        for idx, record_data in enumerate(student_records):
            try:
                # 驗證必要欄位
                required_fields = ['verb', 'time', 'objectType', 'objectName', 'objectId']
                for field in required_fields:
                    if field not in record_data:
                        raise ValueError(f"Missing required field: {field}")

                # 建立記錄物件
                record = StudentRecord(
                    user=user,
                    class_name=class_name,
                    task_id=record_data['taskId'],
                    verb=record_data['verb'],
                    time=record_data['time'],
                    timer=record_data['timer'],
                    object_type=record_data['objectType'],
                    object_name=record_data['objectName'],
                    object_id=record_data['objectId'],
                    context=record_data.get('context', {})
                )
                records_to_create.append(record)

            except Exception as e:
                # 如果某一筆記錄有錯誤，記錄下來並繼續處理其他記錄
                errors.append({'index': idx, 'error': str(e)})
                print(errors)

        # 批量儲存記錄
        if records_to_create:
            StudentRecord.objects.bulk_create(records_to_create)

        # 回應結果
        response_data = {
            'message': 'Records processed successfully',
            'saved_records': len(records_to_create),
            'errors': errors
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f'save student records Error: {e}')
        return Response({'save student records Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student record by student id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_record_by_student_id(request):
    try:
        student_id = request.data.get('student_id')
        record_data = User.objects.get(student_id=student_id).student_records.all().order_by('created_at')

        if not record_data:
            return Response({
                'student_record': 'empty'
            }, status=status.HTTP_204_NO_CONTENT)

        record_result = serialize_records_data(record_data)
        return Response({
            'student_record': record_result
        }, status=status.HTTP_200_OK)


    except Exception as e:
        print(f'get student record by student id Error: {e}')
        return Response({'get student record by student id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get all student record
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_student_record(request):
    try:
        record_data = StudentRecord.objects.all().order_by('created_at')
        student_id_list, student_data_list = serialize_multi_student_record_data(record_data)
        return Response({
            'student_data_list': student_data_list, 'student_id_list': student_id_list
        }, status=status.HTTP_200_OK)


    except Exception as e:
        print(f'get all student record Error: {e}')
        return Response({'get all student record Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student records info by task id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_records_info_by_task_id(request):
    try:
        task_id = request.data.get('task_id')
        student_task_list = Task.objects.get(id=task_id).student_tasks.select_related(
            'student__student_group'
        )

        group_info = {}
        for student_task in student_task_list:
            group_info[student_task.student.student_id] = student_task.student.student_group.group_type

        record_data = StudentRecord.objects.filter(task_id=task_id, timer__isnull=False).exclude(
            timer__exact='').order_by('created_at')
        calculate_data = calculate_student_records_info(record_data, group_info)

        return Response({
            'record_data': calculate_data,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get all student record Error: {e}')
        return Response({'get all student record Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
