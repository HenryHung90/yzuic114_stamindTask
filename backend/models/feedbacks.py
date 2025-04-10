from django.contrib.postgres.fields import ArrayField
from django.db import models


class Feedback(models.Model):
    teacher_feedback = ArrayField(
        models.TextField(),
        null=True,
        blank=True,
        default=list,
        verbose_name='老師回饋'
    )

    student_feedback = ArrayField(
        models.TextField(),
        null=True,
        blank=True,
        default=list,
        verbose_name='學生回饋'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'feedbacks'
        verbose_name = "教師回饋"
        verbose_name_plural = "教師回饋列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.student_task}"