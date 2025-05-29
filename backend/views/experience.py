import os
from django.conf import settings
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


# get Task Experience
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_experience(request):
    try:
        task_id = request.data.get('task_id')

        task_data = Task.objects.get(id=task_id)
        experience_data = task_data.experience.content

        if isinstance(experience_data, dict):
            # 如果是空字典，返回空回應
            if not experience_data:
                return Response({'message': 'No experience data available'}, status=status.HTTP_200_OK)
            if not experience_data['experience_files']:
                return Response({'message': 'No experience data available'}, status=status.HTTP_200_OK)

            file_name = experience_data.get('experience_files')[0]
            file_path = os.path.join(settings.MEDIA_ROOT, 'experience_files', file_name)
            # 檢查文件是否存在
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as file:
                    html_content = file.read()
                    # 直接返回 HTML 內容作為純文本
                    return Response({'html_content': html_content}, status=status.HTTP_200_OK)
            else:
                return Response({'message': f'File not found: {file_name}'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'experience_info': experience_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Upload Experience File
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_experience_file(request):
    try:
        task_id = request.data.get('task_id')
        file = request.data.get('file')
        select_node = int(request.data.get('select_node'))

        task_data = Task.objects.get(id=task_id)
        experience_files = task_data.experience.content.get('experience_files', [])

        if len(experience_files) > select_node:
            experience_files[select_node] = file.name
        else:
            for i in range(len(experience_files), select_node + 1):
                if i == select_node:
                    experience_files.append(file.name)
                else:
                    experience_files.append('empty')

        # 確保資料夾存在
        upload_dir = os.path.join(settings.BASE_DIR, 'files/experience_files')
        os.makedirs(upload_dir, exist_ok=True)

        # 儲存檔案到指定資料夾
        file_path = os.path.join(upload_dir, file.name)
        with open(file_path, 'wb') as f:
            for chunk in file.chunks():
                f.write(chunk)

        # 儲存更新的資料
        task_data.experience.content['experience_files'] = experience_files
        task_data.experience.save()

        return Response({'message': 'success', 'file_name': file.name}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload experience file Error: {e}')
        return Response({'upload experience file Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
