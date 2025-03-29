import os
from django.core.management.base import BaseCommand
from backend.models import User


class Command(BaseCommand):
    help = "Create a default user in the database"

    def handle(self, *args, **kwargs):
        # 檢查是否已經存在該用戶
        if not User.objects.filter(student_id="ccj").exists() and os.getenv('DEFAULT_USER') is not None:
            # 創建新用戶
            User.objects.create_user(
                student_id=os.getenv('DEFAULT_USER'),
                password=os.getenv('DEFAULT_PSW'),
                name=os.getenv('DEFAULT_USER'),
                user_type=User.UserType.TEACHER
            )
            self.stdout.write(self.style.SUCCESS("Successfully created default user."))
        else:
            self.stdout.write(self.style.WARNING("Default user already exists."))
