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


# get Task Target
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_plan(request):
    try:
        task_id = request.data.get('task_id')

        plan_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).plan

        select_sub_list = plan_data.select_sub_list
        plan_list = plan_data.plan_list

        return Response({
            'select_sub_list': select_sub_list,
            'plan_list': plan_list,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Upload Task Target
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_task_plan(request):
    try:
        task_id = request.data.get('task_id')
        select_node = int(request.data.get('select_node'))

        select_sub_list = request.data.get('select_sub_list')
        plan_list = request.data.get('plan_list')

        plan_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).plan
        data_select_sub_list = plan_data.select_sub_list if plan_data.select_sub_list else []
        data_plan_list = plan_data.plan_list if plan_data.plan_list else []

        if len(data_select_sub_list) > select_node:
            data_select_sub_list[select_node] = []
            data_plan_list[select_node] = plan_list
        else:
            for i in range(len(data_select_sub_list), select_node + 1):
                if i == select_node:
                    data_select_sub_list.append(select_sub_list)
                    data_plan_list.append(plan_list)
                else:
                    data_select_sub_list.append('empty')
                    data_plan_list.append('empty')

        plan_data.select_sub_list = data_select_sub_list
        plan_data.plan_list = data_plan_list
        plan_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload task plan Error: {e}')
        return Response({'upload task plan Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
