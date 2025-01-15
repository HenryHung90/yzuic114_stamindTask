from django.db import models

class StudentTaskProcess(models.Model):
    process_code = models.OneToOneField(
        'StudentTaskProcessCode',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='計劃執行程式',
        related_name='task_process',
    )

    process_note = models.OneToOneField(
        'StudentTaskProcessNote',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='計劃執行筆記',
        related_name='task_process',
    )

    content = models.JSONField(
        default=dict,
        verbose_name='任務執行設定內容'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_processes'
        verbose_name = '任務執行設定'
        verbose_name_plural = '任務執行設定列表'
        ordering = ['-created_at']