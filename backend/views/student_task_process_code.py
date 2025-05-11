import os
import zipfile

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import StudentTask
from yzuic114_webstudy import settings

from datetime import datetime

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def zip_student_process_code(task_name, student_task_data):
    # 定義文件夾路徑
    directory_path = os.path.join(settings.BASE_DIR, '/files/code_zip')

    # 如果文件夾不存在，則創建它
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

    # 定義文件路徑
    file_name = f'student_tasks_{task_name}_{datetime.now().strftime("0000%Y%m%d%H%M%S")}.zip'
    file_path = os.path.join(directory_path, file_name)

    html_info = []
    for student_task in student_task_data:
        code_data = [student_task.process.process_code.html_code,
                     '<style>', student_task.process.process_code.css_code, '</style>',
                     '<script>', student_task.process.process_code.js_code, '</script>',
                     ]
        filename = f"{student_task.student.student_id}.html"
        code_data = "\n".join(code_data)
        html_info.append((filename, code_data))

    with zipfile.ZipFile(file_path, 'w') as zipf:
        for filename, content in html_info:
            zipf.writestr(filename, content)
    return file_name


# Get Student Task Process Code
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_task_process_code(request):
    try:
        task_id = request.data.get('task_id')

        process_code_data = StudentTask.objects.get(student_id=request.user.student_id,
                                                    task_id=task_id).process.process_code

        return Response({
            'html_code': process_code_data.html_code,
            'css_code': process_code_data.css_code,
            'js_code': process_code_data.js_code,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks process code Error: {e}')
        return Response({'get tasks process code Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

        process_code_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks process code Error: {e}')
        return Response({'get tasks process code Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Get Student Task Process Code
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_student_process_code_by_task_id(request):
    try:
        task_id = request.query_params.get('task_id')

        student_data = StudentTask.objects.filter(task_id=task_id)
        zipped_data = zip_student_process_code(student_data[0].task.name, student_data)

        return Response({'message': 'success', 'download_file': zipped_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks process code Error: {e}')
        return Response({'get tasks process code Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
