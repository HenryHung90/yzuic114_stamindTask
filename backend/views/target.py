from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import Task

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
def get_task_target(request):
    try:
        task_id = request.data.get('task_id')

        task_data = Task.objects.get(id=task_id)
        target_data = task_data.target

        target_titles = target_data.targets
        target_descriptions = target_data.descriptions
        target_sub_target_list = target_data.sub_target_list

        return Response({
            'target_titles': target_titles,
            'target_descriptions': target_descriptions,
            'sub_target_list': target_sub_target_list,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Upload Task Target
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_task_target(request):
    try:
        task_id = request.data.get('task_id')
        select_node = int(request.data.get('select_node'))
        title = request.data.get('target_title')
        description = request.data.get('target_description')
        sub_target_list = request.data.get('sub_target_list')

        task_data = Task.objects.get(id=task_id)
        target_data = task_data.target

        data_targets = target_data.targets
        data_descriptions = target_data.descriptions
        data_sub_target_list = [] if target_data.sub_target_list is None else target_data.sub_target_list

        if len(data_targets) > select_node:
            data_targets[select_node] = title
            data_descriptions[select_node] = description
            data_sub_target_list[select_node] = sub_target_list
        else:
            for i in range(len(data_targets), select_node + 1):
                if i == select_node:
                    data_targets.append(title)
                    data_descriptions.append(description)
                    data_sub_target_list.append(sub_target_list)
                else:
                    data_targets.append('empty')
                    data_descriptions.append('empty')
                    data_sub_target_list.append({'title': 'empty', 'description': 'empty'})

        target_data.targets = data_targets
        target_data.descriptions = data_descriptions
        target_data.sub_target_list = data_sub_target_list
        target_data.save()
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload task target Error: {e}')
        return Response({'upload task target Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
