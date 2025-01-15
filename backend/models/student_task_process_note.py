from django.db import models

class StudentTaskProcessNote(models.Model):
    content = models.TextField()

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_process_note'
        verbose_name = "計劃執行筆記"
        verbose_name_plural = "計劃執行筆記列表"
        ordering = ['-created_at']