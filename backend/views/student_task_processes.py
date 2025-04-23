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


# Get process hint reply
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_process_hint_reply(request):
    try:
        task_id = request.data.get('task_id')

        process_hint_reply_data = StudentTask.objects.get(student_id=request.user.student_id,
                                                          task_id=task_id).process.process_hint_reply

        return Response({
            'process_hint_reply_list': process_hint_reply_data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Get process hint reply Error: {e}')
        return Response({'Get process hint reply Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Save process hint reply
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_process_hint_reply(request):
    try:
        task_id = request.data.get('task_id')
        select_node = request.data.get('select_node')
        process_hint_reply = request.data.get('process_hint_reply')

        student_task_data = StudentTask.objects.get(student_id=request.user.student_id,
                                                    task_id=task_id).process
        hint_reply = student_task_data.process_hint_reply

        if len(hint_reply) > select_node:
            hint_reply[select_node] = process_hint_reply
        else:
            for i in range(len(hint_reply), select_node + 1):
                if i == select_node:
                    hint_reply.append(process_hint_reply)
                else:
                    hint_reply.append('empty')
        student_task_data.process_hint_reply = hint_reply
        student_task_data.save()

        return Response({
            'message': 'success'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Save process hint reply Error: {e}')
        return Response({'Save process hint reply Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
