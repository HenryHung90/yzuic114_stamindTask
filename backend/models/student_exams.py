from django.contrib.postgres.fields import ArrayField
from django.db import models


class StudentExam(models.Model):
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_exams',
        null=True,
        blank=True,
        verbose_name='班級'
    )

    student = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        related_name='student_exams',
        null=True,
        verbose_name='歸屬學生'
    )

    exam = models.ForeignKey(
        'Exam',
        on_delete=models.SET_NULL,
        related_name='student_exams',
        null=True,
        verbose_name='考卷依據',
    )

    answers = ArrayField(
        models.JSONField(
            default=dict,
            verbose_name='答案內容'
        ),
        default=list,
        verbose_name='考卷答案列表'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_exams'
        verbose_name = '學生答題卷'
        verbose_name_plural = '學生答題卷列表'
        ordering = ['class_name', '-created_at']

    def __str__(self):
        return f"{self.exam.name} - {self.class_name.name} - {self.student.name}"
