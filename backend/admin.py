from django.contrib import admin

from backend.models.class_names import ClassName
from backend.models.exams import Exam
from backend.models.experiences import Experience
from backend.models.feedbacks import Feedback
from backend.models.reflection_questions import ReflectionQuestion
from backend.models.student_exams import StudentExam
from backend.models.student_groups import StudentGroup
from backend.models.student_record import StudentRecord
from backend.models.student_task_plans import StudentTaskPlan
from backend.models.student_task_process_code import StudentTaskProcessCode
from backend.models.student_task_processes import StudentTaskProcess
from backend.models.student_task_reflections import StudentTaskReflection
from backend.models.student_tasks import StudentTask
from backend.models.tasks import Task
from backend.models.text_books import TextBook
from backend.models.users import User



# Register your models here.
# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ['class_name','student_id', 'user_type', 'name']
#     search_fields = ['class_name', 'student_id', 'user_type']
#     readonly_fields = ['created_at', 'updated_at']