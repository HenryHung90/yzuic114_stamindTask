from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

# model
from backend.models import ClassName, User

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
                'student_id': student.student_id,
                'name': student.name,
            })
    return students_data


def serialized_student_groups_info(student_groups_info):
    student_groups_data = {}
    for group in student_groups_info:
        student_groups_data[f'{group.group_type}'] = {
            'class_name': group.class_name.name,
            'group_type': group.group_type,
            'student_list': serialized_students_info(group.users.filter(user_type='STUDENT'))
        }
    return student_groups_data


# get student groups by class name
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_student_groups_by_class_name(request):
    try:
        class_name = request.data.get('class_name')

        class_data = ClassName.objects.get(name=class_name)
        student_groups = serialized_student_groups_info(class_data.student_groups.all())

        return Response({'student_group_info': student_groups}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get student groups Error: {e}')
        return Response({'get student groups Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
# add new student group
def add_new_student_group(request):
    try:
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'add new student group Error: {e}')
        return Response({'add new student group Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# update student group by student id
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update_student_group_by_student_id(request):
    try:
        class_name = request.data.get('class_name')
        student_id = request.data.get('student_id')
        change_group = request.data.get('change_group')
        new_student_group = ClassName.objects.get(name=class_name).student_groups.get(group_type=change_group)
        student_data = User.objects.get(student_id=student_id)
        student_data.student_group = new_student_group

        student_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'update student group Error: {e}')
        return Response({'update student group Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
