from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from django.views.decorators.csrf import ensure_csrf_cookie

# model
from backend.models import ClassName, StudentGroup, StudentTask

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
        print(f'get all class names Error: {e}')
        return Response({'get all class names Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
# add new class name
def add_new_class_name(request):
    try:
        new_class_name = request.data.get('class_name')

        with transaction.atomic():
            new_class = ClassName.objects.create(name=new_class_name)
            StudentGroup.objects.create(group_type='EXPERIMENTAL', class_name=new_class)
            StudentGroup.objects.create(group_type='CONTROL', class_name=new_class)

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'add new class name Error: {e}')
        return Response({'add new class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
