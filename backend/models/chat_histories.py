from django.contrib.postgres.fields import ArrayField
from django.db import models

from datetime import datetime


class ChatHistory(models.Model):
    chat_history = ArrayField(
        models.JSONField(
            default={
                'time':'%Y-%m-%d %H:%M:%S',
                'sender': '',
                'content': '',
            }
        ),
        default=list
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_histories'
        verbose_name = '聊天記錄'
        verbose_name_plural = '聊天記錄列表'
        ordering = ['-updated_at']
