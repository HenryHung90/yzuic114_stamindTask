from django.urls import path

from backend.views.class_name import get_all_class_names
from backend.views.core import *
from backend.views.task import *
from backend.views.students import *

urlpatterns = []

API_POST = [
    # User 常規操作
    path('register/', register, name='register'),
    path('login/', login_system, name='login'),
]

API_GET = [
    # CSRF
    path('get_csrf_token/', get_csrf_token, name='get_csrf_token'),
    # User Session 相關
    path('logout/', logout_system, name='logout'),
    path('get_userinfo/', userinfo_view, name='userinfo_view'),

    # User tasksinfo 相關
    path('get_tasks_info/', get_tasks_info, name='taskinfo_view'),
]

API_ADMIN_POST = [
    # get students by class_name
    path('admin/get_students_by_class_name/', get_students_by_class_name, name='get_students_by_class_name'),

    # switch student active
    path('admin/switch_student_active/', switch_student_active, name='switch_student_active'),
    # switch student group
    path('admin/switch_student_group/', switch_student_group, name='switch_student_group'),
    # change student class_name
    path('admin/change_student_class_name/', change_student_class_name, name='change_student_class_name'),
    # change student name
    path('admin/change_student_name/', change_student_name, name='change_student_name'),
    # change student password
    path('admin/change_student_password/', change_student_password, name='change_student_password'),
]
API_ADMIN_GET = [
    # get all students
    path('admin/get_all_students/', get_all_students, name='get_all_students'),
    # get all class_name
    path('admin/get_all_class_name/', get_all_class_names, name='all_class_names'),
]

urlpatterns += API_POST + API_GET + API_ADMIN_POST + API_ADMIN_GET
