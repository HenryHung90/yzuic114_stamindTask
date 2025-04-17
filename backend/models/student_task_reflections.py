from django.contrib.postgres.fields import ArrayField
from django.db import models


class StudentTaskReflection(models.Model):
    self_scoring = ArrayField(
        models.IntegerField(),
        null=True,
        blank=True,
        default=list,
        verbose_name="自我評分列表"
    )

    completed_targets = models.JSONField(
        null=True,
        blank=True,
        verbose_name="是否完成子任務列表",
        help_text='包含是否完成子任務的 Boolean 的 Array<JSON> 格式資料'
    )

    reflects = models.JSONField(
        null=True,
        blank=True,
        verbose_name="反思回饋 JSON 格式"
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_reflections'
        verbose_name = '任務反思設定'
        verbose_name_plural = '任務反思設定列表'
        ordering = ['-created_at']
