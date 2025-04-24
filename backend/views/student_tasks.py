from django.db.models.expressions import result
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction

from backend.models import Task, StudentTask, User, StudentTaskPlan, StudentTaskProcess, \
    StudentTaskProcessCode, StudentTaskReflection, Feedback, ClassName

from ..utils import transfer_key_to_values

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def serialize_student_id_list(student_task_data):
    serialized_data = []
    for student_task in student_task_data:
        student_id = student_task.user.student_id
        serialized_data.append(student_id)
    return serialized_data


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

                if isinstance(data, dict):
                    serialized_data.append(f'學生回覆:{data.get("reflect")}')
                else:
                    for plan_detail in data:  # 將字典內容格式化為字串
                        detail_str = ', '.join(
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
    task_name = student_task.task.name
    sub_target_list = student_task.task.target.sub_target_list
    student_plan = serialize_task_reflection_and_plan_data(student_task.plan.plan_list, sub_target_list, '子目標')

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
        '計劃內容': student_plan,
        '程式碼_HTML': str(getattr(student_code, 'html_code', '無HTML程式碼')),
        '程式碼_CSS': str(getattr(student_code, 'css_code', '無HTML程式碼')),
        '程式碼_JS': str(getattr(student_code, 'js_code', '無JS程式碼')),
        '實作提示反饋': str(student_hint_reply),
        '反思內容': str(student_reflects),
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

        task_data = Task.objects.get(id=task_id)
        student_task_data = task_data.student_task.filter(student_id=request.user.student_id).first()

        if student_task_data is None:
            with transaction.atomic():
                student = User.objects.get(student_id=request.user.student_id)
                class_name = task_data.class_name

                plan = StudentTaskPlan.objects.create()
                process_code = StudentTaskProcessCode.objects.create()
                process = StudentTaskProcess.objects.create(
                    process_code=process_code,
                )
                reflection = StudentTaskReflection.objects.create()
                feedback = Feedback.objects.create()

                StudentTask.objects.create(
                    student=student,
                    class_name=class_name,
                    task=task_data,
                    plan=plan,
                    process=process,
                    reflection=reflection,
                    feedback=feedback,
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

        result_data = serialize_student_task_data(student_tasks_data)
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
