from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import StudentTask

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# get Student Task Reflection
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_reflections(request):
    try:
        task_id = request.data.get('task_id')

        task_reflection_data = StudentTask.objects.get(task_id=task_id, student_id=request.user.student_id).reflection

        return Response({
            'reflect_list': task_reflection_data.reflects
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get student Error: {e}')
        return Response({'get reflection questions Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# save Reflection Questions
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_student_task_reflections(request):
    try:
        task_id = request.data.get('task_id')
        select_node = int(request.data.get('select_node'))
        reflects = request.data.get('reflects')

        task_reflection_data = StudentTask.objects.get(task_id=task_id, student_id=request.user.student_id).reflection

        reflect_data = task_reflection_data.reflects if task_reflection_data.reflects else []

        if len(reflect_data) > select_node:
            reflect_data[select_node] = reflects
        else:
            for i in range(len(reflect_data), select_node + 1):
                if i == select_node:
                    reflect_data.append(reflects)
                else:
                    reflect_data.append('empty')

        task_reflection_data.reflects = reflect_data
        task_reflection_data.save()
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save Student Task Reflection Error: {e}')
        return Response({'save Student Task Reflection Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
