from django.urls import path

from backend.views.class_name import get_all_class_names, add_new_class_name
from backend.views.core import *
from backend.views.experience import *
from backend.views.student_notes import *
from backend.views.student_task_plans import *
from backend.views.student_tasks import *
from backend.views.students import *
from backend.views.target import *
from backend.views.task import *
from backend.views.text_books import *
from backend.views.student_task_process_code import *
from backend.views.reflection_questions import *
from backend.views.student_task_reflections import *
from backend.views.chat_histories import *
from backend.views.chatgpt import *
from backend.views.student_records import *
from backend.views.student_group import *

urlpatterns = []

API_POST = [
    # User 常規操作
    path('register/', register, name='register'),
    path('login/', login_system, name='login'),

    # get Task Diagram
    path('get_task_diagram/', get_task_diagram, name='get_task_diagram'),
    # get Task Experience
    path('get_task_experience/', get_task_experience, name='get_task_experience'),
    # get Task Target
    path('get_task_target/', get_task_target, name='get_task_target'),
    # get Text Book
    path('get_text_book/', get_text_book, name='get_text_book'),

    # init Student Task
    path('init_student_task/', init_student_task, name='init_student_task'),

    # get Task Plan
    path('get_task_plan/', get_task_plan, name='get_task_plan'),
    # upload Student Task Plan
    path('upload_task_plan/', upload_task_plan, name='upload_task_plan'),

    # get Process Code
    path('get_student_task_process_code/', get_student_task_process_code, name='get_student_task_process_code'),
    # save Process Code
    path('save_student_task_process_code/', save_student_task_process_code, name='save_student_task_process_code'),

    # get Reflection Questions
    path('get_reflection_questions/', get_reflection_questions, name='get_reflection_questions'),

    # get Student Task Reflection
    path('get_student_task_reflections/', get_student_task_reflections, name='get_student_task_reflections'),
    # save Student Task Reflection
    path('save_student_task_reflections/', save_student_task_reflections, name='save_student_task_reflections'),

    # chat with AmumAmum
    path('chat_with_amumamum/', chat_with_amumamum, name='chat_with_amumamum'),
    # get Chat History
    path('get_chat_histories/', get_chat_histories, name='get_chat_histories'),

    # save student note
    path('save_student_note/', save_student_note, name='save_student_note'),

    # save student record
    path('save_student_records/', save_student_records, name='save_student_records'),
]

API_GET = [
    # CSRF
    path('get_csrf_token/', get_csrf_token, name='get_csrf_token'),
    # User Session 相關
    path('logout/', logout_system, name='logout'),
    path('get_userinfo/', userinfo_view, name='userinfo_view'),

    # User tasksinfo 相關
    path('get_tasks_info/', get_tasks_info, name='taskinfo_view'),

    # User Note 相關
    path('get_student_note/', get_student_note, name='get_student_note'),
]

API_ADMIN_POST = [
    # get students by class_name
    path('admin/get_students_by_class_name/', get_students_by_class_name, name='get_students_by_class_name'),
    # get class name by class_name
    path('admin/get_tasks_by_class_name/', get_tasks_by_class_name, name='get_tasks_by_class_name'),
    # get student group by class_name
    path('admin/get_student_groups_by_class_name/', get_student_groups_by_class_name, name='get_student_groups_by_class_name'),

    # update student group by student_id
    path('admin/update_student_group_by_student_id/', update_student_group_by_student_id, name='update_student_group_by_student_id'),

    # add new class name
    path('admin/add_new_class_name/', add_new_class_name, name='add_new_class_name'),
    # add new Task
    path('admin/add_new_task/',add_new_task, name='add_new_task'),
    # save Task
    path('admin/save_task_diagram/', save_task_diagram, name='save_task_diagram'),
    # upload Experience file
    path('admin/upload_experience_file/', upload_experience_file, name='upload_experience_file'),
    # upload Task Target
    path('admin/upload_task_target/', upload_task_target, name='upload_task_target'),
    # upload Task TextBook file
    path('admin/upload_text_book_file/', upload_text_book_file, name='upload_text_book_file'),
    # save Reflection Questions
    path('admin/save_reflection_questions/', save_reflection_questions, name='save_reflection_questions'),

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
    # get all tasks
    path('admin/get_all_tasks_info/', get_all_tasks_info, name='all_tasks_info'),
]

urlpatterns += API_POST + API_GET + API_ADMIN_POST + API_ADMIN_GET
