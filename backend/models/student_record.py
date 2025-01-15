from django.contrib.postgres.fields import ArrayField
from django.db import models


class StudentRecord(models.Model):
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_records',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    action_record = ArrayField(
        models.JSONField(
            default={
                'action_name': '',
                'action_id': '',
                'verb': '',
                'object_type': '',
                'object_id': '',
                'object_name': '',
                'context': ''
            }
        )
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_records'
        verbose_name = '學生操作記錄'
        verbose_name_plural = '學生操作記錄列表'
        ordering = ['-created_at']
