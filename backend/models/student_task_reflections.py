from django.contrib.postgres.fields import ArrayField
from django.db import models


class StudentTaskReflection(models.Model):
    score = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="自我評分",
    )

    reflects = ArrayField(
        models.CharField(max_length=500),
        null=True,
        blank=True,
        default=list,
        verbose_name='反思回饋列表'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_reflections'
        verbose_name = '任務反思設定'
        verbose_name_plural = '任務反思設定列表'
        ordering = ['-created_at']