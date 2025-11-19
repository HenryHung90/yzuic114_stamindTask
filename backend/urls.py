from django.urls import path

from backend.views.class_name import get_all_class_names, add_new_class_name
from backend.views.core import *
from backend.views.experience import *
from backend.views.graphrag import *
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
from backend.views.feedbacks import *
from backend.views.chat_histories import *
from backend.views.chatgpt import *
from backend.views.student_records import *
from backend.views.student_group import *
from backend.views.process_hints import *
from backend.views.student_task_processes import *

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

    # get Process Hint
    path('get_process_hint/', get_process_hint, name='get_process_hint'),
    # get Process Hint Reply
    path('get_process_hint_reply/', get_process_hint_reply, name='get_process_hint_reply'),
    # save Process Hint Reply
    path('save_process_hint_reply/', save_process_hint_reply, name='save_process_hint_reply'),

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

    # get teacher feedback
    path('get_teacher_feedback/', get_teacher_feedback, name='get_teacher_feedback'),
    # generate teacher feedback
    path('generate_teacher_feedback/', generate_teacher_feedback, name='generate_teacher_feedback'),

    # chat with AmumAmum
    path('chat_with_amumamum/', chat_with_amumamum, name='chat_with_amumamum'),
    # get Chat History
    path('get_chat_histories/', get_chat_histories, name='get_chat_histories'),

    # save student note
    path('save_student_note/', save_student_note, name='save_student_note'),

    # save student record
    path('save_student_records/', save_student_records, name='save_student_records'),

    # get graphrag detail by type and id
    path('get_graphrag_detail_by_type_and_id/', get_graphrag_detail_by_type_and_id,
         name='get_graphrag_detail_by_type_and_id'),
    # specify chat with AmumAmum
    path('specific_chat_with_amumamum/', specific_chat_with_amumamum, name='specific_chat_with_amumamum'),
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
    path('admin/get_student_groups_by_class_name/', get_student_groups_by_class_name,
         name='get_student_groups_by_class_name'),

    # update student group by student_id
    path('admin/update_student_group_by_student_id/', update_student_group_by_student_id,
         name='update_student_group_by_student_id'),

    # get chat histories by student id
    path('admin/get_chat_histories_by_student_id/', get_chat_histories_by_student_id,
         name='get_chat_histories_by_student_id'),
    # get chat ai heat map by task id
    path('admin/get_chat_ai_heat_map_by_task_id/', get_chat_ai_heat_map_by_task_id,
         name='get_chat_ai_heat_map_by_task_id'),
    # get chat ai heat map by class ids
    path('admin/get_chat_ai_heat_map_by_class_ids/', get_chat_ai_heat_map_by_class_ids,
         name='get_chat_ai_heat_map_by_class_ids'),
    # get feedback by student id
    path('admin/get_feedback_by_student_id/', get_feedback_by_student_id, name='get_feedback_by_student_id'),
    # get student record by student id
    path('admin/get_student_record_by_student_id/', get_student_record_by_student_id,
         name='get_student_record_by_student_id'),
    # get student task by student id
    path('admin/get_student_task_by_student_id/', get_student_task_by_student_id,
         name='get_student_task_by_student_id'),
    # get student tasks by task id
    path('admin/get_student_tasks_by_task_id/', get_student_tasks_by_task_id, name='get_student_tasks_by_task_id'),
    # get student task by class name
    path('admin/get_student_task_by_class_name/', get_student_task_by_class_name,
         name='get_student_task_by_class_name'),
    # get student tasks by class ids
    path('admin/get_student_task_by_class_ids/', get_student_task_by_class_ids, name='get_student_task_by_class_ids'),
    # get all student task
    path('admin/get_all_student_task/', get_all_student_task, name='get_all_student_task'),
    # get all student record
    path('admin/get_all_student_record/', get_all_student_record, name='get_all_student_record'),
    # get all student records info by task id
    path('admin/get_student_records_info_by_task_id/', get_student_records_info_by_task_id,
         name='get_student_records_by_task_id'),
    # get student records info by class ids
    path('admin/get_student_records_info_by_class_ids/', get_student_records_info_by_class_ids,
         name='get_student_records_info_by_class_ids'),
    # get student process code by task id
    path('admin/get_all_student_process_code_by_task_id/', get_all_student_process_code_by_task_id,
         name='get_all_student_process_code_by_task_id'),
    # get student feedback by task id
    path('admin/get_feedback_by_task_id/', get_feedback_by_task_id, name='get_feedback_by_task_id'),

    # get all chat histories by class ids
    path('admin/get_all_chat_histories_by_class_ids/', get_all_chat_histories_by_class_ids,
         name='all_chat_histories_by_class_ids'),

    # add new class name
    path('admin/add_new_class_name/', add_new_class_name, name='add_new_class_name'),
    # add new Task
    path('admin/add_new_task/', add_new_task, name='add_new_task'),
    # save Task
    path('admin/save_task_diagram/', save_task_diagram, name='save_task_diagram'),
    # switch task open
    path('admin/switch_task_open/', switch_task_open, name='switch_task_open'),
    # change task name
    path('admin/change_task_name/', change_task_name, name='change_task_name'),

    # upload Experience file
    path('admin/upload_experience_file/', upload_experience_file, name='upload_experience_file'),
    # save Task Target
    path('admin/save_task_target/', save_task_target, name='save_task_target'),
    # upload Task TextBook file
    path('admin/upload_text_book_file/', upload_text_book_file, name='upload_text_book_file'),
    # save Process Hints
    path('admin/save_process_hint/', save_process_hint, name='save_process_hint'),
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
    # multi students upload
    path('admin/multi_students_upload/', multi_students_upload, name='multi_students_upload'),

    # get task graphrag info
    path('admin/get_task_graphrag_info/', get_task_graphrag_info, name='get_task_graphrag_info'),
    # upload graphrag file
    path('admin/upload_graphrag_file/', upload_graphrag_file, name='upload_graphrag_file'),
]
API_ADMIN_GET = [
    # get all students
    path('admin/get_all_students/', get_all_students, name='get_all_students'),
    # get all class_name
    path('admin/get_all_class_name/', get_all_class_names, name='all_class_names'),
    # get all tasks
    path('admin/get_all_tasks_info/', get_all_tasks_info, name='all_tasks_info'),
    # get all chat histories
    path('admin/get_all_chat_histories/', get_all_chat_histories, name='all_chat_histories'),
]

urlpatterns += API_POST + API_GET + API_ADMIN_POST + API_ADMIN_GET
