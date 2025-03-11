from django.db import models


class StudentNote(models.Model):
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_notes',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    notes = models.JSONField(
        default=dict,
        null=True,
        blank=True,
        verbose_name="學生筆記內容"
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_notes'
        verbose_name = '學生筆記'
        verbose_name_plural = '學生筆記列表'
        ordering = ['-created_at']
