from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

# model
from backend.models import ClassName

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""

# get all class name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_class_names(request):
    try:
        class_data = ClassName.objects.all()

        # 將 QuerySet 轉換為可序列化的格式
        class_info = []
        for className in class_data:
            class_info.append({
                'id': className.id,
                'name': className.name,
                'created_at': className.created_at.strftime('%Y-%m-%d %H:%M'),
                'updated_at': className.updated_at.strftime('%Y-%m-%d %H:%M'),
            })
        return Response({'class_info': class_info, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Userinfo Error: {e}')
        return Response({'get all class names Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)