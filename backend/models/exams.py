from django.contrib.postgres.fields import ArrayField
from django.db import models


class Exam(models.Model):
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='exams',
        null=True,
        blank=True,
        verbose_name='班級'
    )

    name = models.CharField(
        max_length=100,
        verbose_name='考卷名稱'
    )

    is_open = models.BooleanField(
        default=True,
    )

    class GroupType(models.TextChoices):
        EXPERIMENTAL = 'EXPERIMENTAL', '實驗組'
        CONTROL = 'CONTROL', '對照組'

    group_type = models.CharField(
        max_length=20,
        choices=GroupType.choices,
        default=GroupType.EXPERIMENTAL,
        verbose_name='組別類型'
    )

    questions = ArrayField(
        models.JSONField(
            default=dict,
            verbose_name='題目內容'
        ),
        default=list,
        verbose_name='考卷題目列表'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exams'
        verbose_name = '考卷'
        verbose_name_plural = '考卷列表'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.name}"
