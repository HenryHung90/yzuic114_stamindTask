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


# Get Student Task Process Code
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_process_code(request):
    try:
        task_id = request.data.get('task_id')

        process_code_data = StudentTask.objects.get(student_id=request.user.student_id,
                                                    task_id=task_id).process.process_code

        print(process_code_data)

        return Response({
            'message': 'success',
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Save Student Task Process Code
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_student_task_process_code(request):
    try:
        task_id = request.data.get('task_id')
        html_code_data = request.data.get('html_code')
        css_code_data = request.data.get('css_code')
        js_code_data = request.data.get('js_code')

        process_code_data = StudentTask.objects.get(student_id=request.user.student_id,
                                                    task_id=task_id).process.process_code
        process_code_data.html_code = html_code_data
        process_code_data.css_code = css_code_data
        process_code_data.js_code = js_code_data

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
