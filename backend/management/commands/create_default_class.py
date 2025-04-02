import os
from django.core.management.base import BaseCommand
from backend.models import ClassName


class Command(BaseCommand):
    help = "Create a default class in the database"

    def handle(self, *args, **kwargs):
        # 檢查是否已經存在該班級
        if not ClassName.objects.filter(name=os.getenv('DEFAULT_CLASSNAME')).exists():
            # 創建新用戶
            ClassName.objects.create(name=os.getenv('DEFAULT_CLASSNAME'))
            self.stdout.write(self.style.SUCCESS("Successfully created default class."))
        else:
            self.stdout.write(self.style.WARNING("Default class already exists."))
