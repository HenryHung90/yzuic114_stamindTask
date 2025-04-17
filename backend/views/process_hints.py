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


# get Process Hint
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_process_hint(request):
    try:
        task_id = request.data.get('task_id')

        process_hint_data = Task.objects.get(id=task_id).process_hint

        return Response({
            'process_hint_list': process_hint_data.hints
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get process hints Error: {e}')
        return Response({'get process hints Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# save Process Hint
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_process_hint(request):
    try:
        task_id = request.data.get('task_id')
        select_node = request.data.get('select_node')
        process_hint_list = request.data.get('process_hint_list')
        process_hint_data = Task.objects.get(id=task_id).process_hint
        hints = process_hint_data.hints if process_hint_data.hints else []

        if len(hints) > select_node:
            hints[select_node] = process_hint_list
        else:
            for i in range(len(hints), select_node + 1):
                if i == select_node:
                    hints.append(process_hint_list)
                else:
                    hints.append('empty')

        process_hint_data.hints = hints
        process_hint_data.save()

        return Response({
            'message': 'success'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save process hints Error: {e}')
        return Response({'save process hints Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
