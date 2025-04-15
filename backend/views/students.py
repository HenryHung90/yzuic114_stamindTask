import os
import openpyxl
import xlrd
from io import BytesIO

from django.contrib.auth.hashers import make_password
from django.db import transaction, IntegrityError
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..utils import read_xlsx_and_xls_file

# model
from backend.models import ClassName, User, StudentGroup, ChatHistory

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def serialized_students_info(students_info):
    students_data = []
    for student in students_info:
        if not student.is_superuser and student:
            students_data.append({
                'is_active': student.is_active,
                'class_name': student.class_name.name if student.class_name else "尚未分配",
                'group_type': student.student_group.group_type if student.student_group else "尚未分配",
                'student_id': student.student_id,
                'name': student.name,
                'created_at': student.created_at.strftime('%Y-%m-%d %H:%M'),
                'updated_at': student.updated_at.strftime('%Y-%m-%d %H:%M'),
            })
    return students_data


# get all students
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_students(request):
    try:
        students_info = User.objects.all()

        # 將 QuerySet 轉換為可序列化的格式
        students_data = serialized_students_info(students_info)
        return Response({'students_data': students_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get all student info Error: {e}')
        return Response({'get all student info Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get student by class name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_students_by_class_name(request):
    try:
        class_name_instance = ClassName.objects.get(name=request.data.get('class_name'))
        students_info = User.objects.filter(class_name=class_name_instance)

        # 將 QuerySet 轉換為可序列化的格式
        students_data = serialized_students_info(students_info)
        return Response({'students_data': students_data, 'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get student info Error: {e}')
        return Response({'get student info Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# switch student active
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def switch_student_active(request):
    try:
        student_info = User.objects.get(student_id=request.data.get('student_id'))

        student_info.is_active = not student_info.is_active
        student_info.save()
        return Response({'student_data': {'student_id': student_info.student_id, 'is_active': student_info.is_active},
                         'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get student info Error: {e}')
        return Response({'get student info Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# switch student group
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def switch_student_group(request):
    try:
        student_info = User.objects.get(student_id=request.data.get('student_id'))
        student_group = StudentGroup.objects.filter(class_name=student_info.class_name)

        if len(student_group) == 0:
            return Response({'message': '尚未設定該年級之組別'}, status=status.HTTP_400_BAD_REQUEST)

        current_group = student_info.student_group
        if current_group is None:
            student_info.student_group = student_group[0]
        else:
            student_info.student_group = student_group[0] if current_group.group_type == student_group[
                1].group_type else student_group[1]

        student_info.save()
        return Response({'student_data': {'student_id': student_info.student_id,
                                          'group_type': student_info.student_group.group_type},
                         'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'switch student group Error: {e}')
        return Response({'switch student group Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# change student class_name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def change_student_class_name(request):
    try:
        student_info = User.objects.get(student_id=request.data.get('student_id'))
        new_class_info = ClassName.objects.get(name=request.data.get('exchange_class_name'))
        new_student_group = StudentGroup.objects.get(class_name=new_class_info,
                                                     group_type='CONTROL')

        student_info.class_name = new_class_info
        student_info.student_group = new_student_group
        student_info.save()

        return Response({'student_data': {'student_id': student_info.student_id,
                                          'class_name': student_info.class_name.name,
                                          'group_type': student_info.student_group.group_type},
                         'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'change student class name Error: {e}')
        return Response({'change student class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# change student name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def change_student_name(request):
    try:
        student_info = User.objects.get(student_id=request.data.get('student_id'))
        student_info.name = request.data.get('new_name')
        student_info.save()

        return Response({'student_data': {'student_id': student_info.student_id,
                                          'name': student_info.name},
                         'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'change student class name Error: {e}')
        return Response({'change student class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# change student password
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def change_student_password(request):
    try:
        student_info = User.objects.get(student_id=request.data.get('student_id'))
        student_info.password = make_password(request.data.get('new_password'))
        student_info.save()

        return Response({'student_data': {'student_id': student_info.student_id},
                         'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'change student class name Error: {e}')
        return Response({'change student class name Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# multi students upload
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def multi_students_upload(request):
    try:
        students_data = request.data.get('student_list')
        if not students_data:
            return Response({"error": "未收到文件"}, status=status.HTTP_400_BAD_REQUEST)

        file_extension = students_data.name.split('.')[-1].lower()
        expected_headers = ['班級', '學號', '密碼', '姓名', '使用者類別']

        if file_extension == 'xls':
            # 使用 xlrd 讀取 .xls 文件
            workbook = xlrd.open_workbook(file_contents=students_data.read())
            sheet = workbook.sheet_by_index(0)
            # 取得標頭，用於確認是否符合資料格式
            headers = sheet.row_values(0)[:5]
            student_list = read_xlsx_and_xls_file(expected_headers, headers, file_extension, sheet)
        elif file_extension == 'xlsx':
            # 使用 openpyxl 讀取 .xlsx 文件
            wb = openpyxl.load_workbook(filename=BytesIO(students_data.read()))
            sheet = wb.active
            # 取得標頭，用於確認是否符合資料格式
            headers = [cell for cell in next(sheet.iter_rows(min_row=1, max_row=1, values_only=True))][:5]
            student_list = read_xlsx_and_xls_file(expected_headers, headers, file_extension, sheet)
        else:
            return Response({'message': '不支援的格式'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for student in student_list:
                # 驗證 user_type 是否正確
                user_type = student.get('user_type')
                if user_type not in [User.UserType.TEACHER, User.UserType.STUDENT]:
                    return Response({'message': f'Invalid user type\n DATA:{student}', 'status': 400},
                                    status=status.HTTP_400_BAD_REQUEST)
                try:
                    # 嘗試從資料庫中獲取對應的 ClassName 實例
                    class_name = ClassName.objects.get(name=student.get('class_name'))
                    student_group = StudentGroup.objects.get(group_type="CONTROL", class_name=class_name)
                except ClassName.DoesNotExist:
                    return Response({'message': f'Class name does not exist\n DATA:{student}', 'status': 404},
                                    status=status.HTTP_404_NOT_FOUND)
                chat_history = ChatHistory.objects.create()

                print('student create process:', student)
                try:
                    # 創建新用戶
                    User.objects.create_user(
                        student_id=student.get('student_id'),
                        password=student.get('password'),
                        name=student.get('name'),
                        user_type=user_type,
                        chat_history=chat_history,
                        class_name=class_name,
                        student_group=student_group,
                    )
                except IntegrityError:
                    return Response({'message': f'User is already exist\n DATA:{student}', 'status': 404},
                                    status=status.HTTP_404_NOT_FOUND)


        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'multi student upload Error: {e}')
        return Response({'multi student upload Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
