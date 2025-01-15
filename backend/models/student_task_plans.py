from django.db import models

class StudentTaskPlan(models.Model):
    content = models.JSONField(
        default=dict,
        verbose_name='任務計畫設定內容'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_plans'
        verbose_name = '任務計劃設定'
        verbose_name_plural = '任務計畫設定列表'
        ordering = ['-created_at']