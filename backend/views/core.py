from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from torch.distributed import group

# User model
from backend.models import User, ClassName, StudentGroup, ChatHistory, StudentRecord

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# CSRF Token
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'message': 'CSRF cookie set'})


# 註冊系統
@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def register(request):
    try:
        data = request.data

        # 檢測是否有 User 重複
        if User.objects.filter(student_id=data.get('student_id')).exists():
            return Response({'message': 'Username already exists', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        # 驗證 user_type 是否正確
        user_type = data.get('user_type')
        if user_type not in [User.UserType.TEACHER, User.UserType.STUDENT]:
            return Response({'message': 'Invalid user type', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        # 如果是學生，檢查是否提供了 class_name
        class_name = data.get('class_name')
        if user_type == User.UserType.STUDENT:
            if not class_name:
                return Response({'message': 'Class name is required for students', 'status': 400},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                # 嘗試從資料庫中獲取對應的 ClassName 實例
                class_name = ClassName.objects.get(name=data.get('class_name'))
            except ClassName.DoesNotExist:
                return Response({'message': 'Class name does not exist', 'status': 404},
                                status=status.HTTP_404_NOT_FOUND)

        chat_history = ChatHistory.objects.create()

        # 創建新用戶
        user = User.objects.create_user(
            student_id=data.get('student_id'),
            password=data.get('password'),
            name=data.get('name'),
            user_type=user_type,
            chat_history=chat_history,
        )

        # 如果是學生，設置 class_name
        if user_type == User.UserType.STUDENT:
            student_group = StudentGroup.objects.get(group_type="CONTROL", class_name=class_name)
            user.class_name = class_name
            user.student_group = student_group

        # 保存用戶
        user.save()
        return Response({'message': 'User registered successfully', 'status': 200}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'Register Error: {e}')
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# 登入系統
@api_view(['POST'])
@permission_classes([AllowAny])
def login_system(request):
    try:
        data = request.data
        acc = data.get('student_id')
        psw = data.get('password')

        # 確認帳號密碼是否為空
        if acc is None or psw is None or acc == '' or psw == '':
            return Response({'message': '帳號或密碼不得為空', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        # 登入
        user = authenticate(student_id=acc, password=psw, request=request._request)
        student_info = User.objects.get(student_id=acc)
        if user is None:
            return Response({'message': '無此用戶或帳號密碼錯誤', 'status': 403}, status=status.HTTP_403_FORBIDDEN)

        login(request._request, user)

        return Response(
            {'message': 'success', 'name': student_info.name, 'user_type': student_info.user_type,
             'student_id': student_info.student_id, 'status': 200},
            status=status.HTTP_200_OK)

    except Exception as e:
        print(f'Login Error: {e}')
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# 登出系統
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def logout_system(request):
    try:
        if not request.user.is_authenticated:
            return Response({'message': '未有帳戶登入', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        logout(request._request)
        return Response({'message': 'logout success', 'status': 200}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Logout Error: {e}')
        return Response({'Logout Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# User Info
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def userinfo_view(request):
    try:
        if request.user.is_authenticated:
            student_info = User.objects.get(student_id=request.user.student_id)
            return Response(
                {'name': student_info.name, 'student_id': student_info.student_id,
                 'isAuthenticated': student_info.user_type},
                status=status.HTTP_200_OK)
        else:
            return Response({'isAuthenticated': request.user.is_authenticated}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Userinfo Error: {e}')
        return Response({'userinfo Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
