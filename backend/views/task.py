from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction

# model
from backend.models import Task, ClassName, Experience, Target, TextBook, ReflectionQuestion, ProcessHints

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def serialize_tasks(tasks):
    """
    將 Task QuerySet 序列化為列表格式
    """
    tasks_data = []
    if tasks:
        for task in tasks:
            tasks_data.append({
                'id': task.id,
                'is_open': task.is_open,
                'class_name': task.class_name.name,
                'name': task.name,
                'created_at': task.created_at.strftime('%Y-%m-%d %H:%M'),
                'updated_at': task.updated_at.strftime('%Y-%m-%d %H:%M'),
            })
    return tasks_data


# Task Info
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_tasks_info(request):
    try:
        tasks_info = Task.objects.filter(class_name=request.user.class_name, is_open=True)

        # 將 QuerySet 轉換為可序列化的格式
        tasks_data = serialize_tasks(tasks_info)
        return Response({'tasks_info': tasks_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks info Error: {e}')
        return Response({'get tasks info Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_tasks_info(request):
    try:
        tasks_info = Task.objects.all()

        # 將 QuerySet 轉換為可序列化的格式
        tasks_data = serialize_tasks(tasks_info)
        return Response({'tasks_info': tasks_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get all tasks info Error: {e}')
        return Response({'get all tasks Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get Tasks by class_name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_tasks_by_class_name(request):
    try:
        tasks_info = ClassName.objects.get(name=request.data.get('class_name')).tasks.all()

        # 將 QuerySet 轉換為可序列化的格式
        tasks_data = serialize_tasks(tasks_info)
        return Response({'tasks_info': tasks_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks by class_name Error: {e}')
        return Response({'get tasks by class_name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Add new Task
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_new_task(request):
    try:
        task_name = request.data.get('task_name')
        class_name = request.data.get('class_name')

        class_info = ClassName.objects.get(name=class_name)

        # 使用事務確保所有資料庫操作要麼全部成功，要麼全部失敗
        with transaction.atomic():
            experience = Experience.objects.create(name=task_name + "體驗任務")
            target = Target.objects.create(name=task_name + "目標")
            text_book = TextBook.objects.create(name=task_name + "教材")
            reflection_question = ReflectionQuestion.objects.create(name=task_name + "反思題目")
            process_hint = ProcessHints.objects.create()

            new_task = Task.objects.create(
                name=task_name,
                class_name=class_info,
                is_open=True,
                experience=experience,
                target=target,
                text_book=text_book,
                reflection_question=reflection_question,
                process_hint=process_hint
            )

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'add task info Error: {e}')
        return Response({'add task Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get a Task
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_diagram(request):
    try:
        task_id = request.data.get('task_id')
        task_data = Task.objects.get(id=task_id)

        if task_data.diagram_content:
            return Response({
                'message': 'success',
                'nodes_data': task_data.diagram_content.get("nodes_data", []),
                'links_data': task_data.diagram_content.get("links_data", []),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'empty'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get task info Error: {e}')
        return Response({'get task Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Save Task Diagram
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_task_diagram(request):
    try:
        task_id = request.data.get('task_id')
        nodes_data = request.data.get('node_array')
        links_data = request.data.get('link_array')

        task_data = Task.objects.get(id=task_id)

        task_data.diagram_content = {"nodes_data": nodes_data, "links_data": links_data}
        task_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save task diagram  Error: {e}')
        return Response({'save task diagram Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# switch task open
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def switch_task_open(request):
    try:
        task_id = request.query_params.get('task_id')

        task_data = Task.objects.get(id=task_id)
        task_data.is_open = not task_data.is_open
        task_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save task diagram  Error: {e}')
        return Response({'save task diagram Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# change task name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def change_task_name(request):
    try:
        task_id = request.data.get('task_id')
        task_name = request.data.get('task_name')

        task_data = Task.objects.get(id=task_id)
        task_data.name = task_name
        task_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save task diagram  Error: {e}')
        return Response({'save task diagram Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
