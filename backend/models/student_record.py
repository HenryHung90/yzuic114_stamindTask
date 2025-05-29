from tabnanny import verbose

from django.contrib.postgres.fields import ArrayField
from django.db import models


class StudentRecord(models.Model):
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        null=True,
        related_name='student_records',
        verbose_name='學生',
    )

    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_records',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    task = models.ForeignKey(
        'Task',
        on_delete=models.SET_NULL,
        related_name='student_records',
        null=True,
        blank=True,
        verbose_name="所屬課程"
    )

    verb = models.CharField(
        max_length=50,
        default="",
        verbose_name="行為動詞"
    )

    time = models.CharField(
        max_length=50,
        default="",
        verbose_name='行為發生時間'
    )

    timer = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='時間經過'
    )

    object_type = models.CharField(
        max_length=50,
        default="",
        verbose_name='操作對象類型'
    )

    object_name = models.CharField(
        max_length=100,
        default="",
        verbose_name='操作對象名稱'
    )

    object_id = models.CharField(
        max_length=100,
        default="",
        verbose_name='操作對象 id'
    )

    context = models.JSONField(
        default=dict,
        verbose_name='行為上下文敘述以及完整訊息'
    )


    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_records'
        verbose_name = '學生操作記錄'
        verbose_name_plural = '學生操作記錄列表'
        ordering = ['-created_at']
