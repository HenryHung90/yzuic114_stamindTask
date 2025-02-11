from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

# model
from backend.models import Task

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""
# Task Info
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_tasks_info(request):
    try:
        tasks_info = Task.objects.filter(class_name=request.user.class_name, is_open=True)

        # 將 QuerySet 轉換為可序列化的格式
        tasks_data = []
        for task in tasks_info:
            tasks_data.append({
                'id': task.id,
                'name': task.name,
                'created_at': task.created_at.strftime('%Y-%m-%d %H:%M'),
                'updated_at': task.updated_at.strftime('%Y-%m-%d %H:%M'),
            })
        return Response({'tasks_info': tasks_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Userinfo Error: {e}')
        return Response({'userinfo Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)