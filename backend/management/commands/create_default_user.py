from django.core.management.base import BaseCommand
from backend.models import User


class Command(BaseCommand):
    help = "Create a default user in the database"

    def handle(self, *args, **kwargs):
        # 檢查是否已經存在該用戶
        if not User.objects.filter(student_id="ccj").exists():
            # 創建新用戶
            user = User.objects.create_user(
                student_id='ccj',
                password='ccjccj',
                name='ccj',
                user_type=User.UserType.TEACHER
            )
            self.stdout.write(self.style.SUCCESS("Successfully created default user."))
        else:
            self.stdout.write(self.style.WARNING("Default user already exists."))
