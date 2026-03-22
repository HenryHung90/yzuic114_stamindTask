import os
from django.core.management.base import BaseCommand
from backend.models import User, ChatHistory, ClassName, StudentGroup


class Command(BaseCommand):
    help = "Create a default user and class in the database"

    def handle(self, *args, **kwargs):
        # 檢查是否已經存在該班級
        if not ClassName.objects.filter(name=os.getenv('DEFAULT_CLASSNAME')).exists():
            # 創建新用戶
            class_name = ClassName.objects.create(name=os.getenv('DEFAULT_CLASSNAME'))
            student_group = StudentGroup.objects.create(name='EXPERIMENTAL')
            self.stdout.write(self.style.SUCCESS("Successfully created default class."))
            # 檢查是否已經存在該用戶
            if not User.objects.filter(student_id="ccj").exists() and os.getenv('DEFAULT_USER') is not None:
                chat_history = ChatHistory.objects.create()
                # 創建新用戶
                User.objects.create_user(
                    student_id=os.getenv('DEFAULT_USER'),
                    password=os.getenv('DEFAULT_PSW'),
                    name=os.getenv('DEFAULT_USER'),
                    user_type=User.UserType.TEACHER,
                    chat_history=chat_history,
                    student_group=student_group,
                    class_name=class_name
                )
                self.stdout.write(self.style.SUCCESS("Successfully created default user."))
            else:
                self.stdout.write(self.style.WARNING("Default user already exists."))
        else:
            self.stdout.write(self.style.WARNING("Default class already exists."))
