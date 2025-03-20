from django.db import models


class StudentTaskPlan(models.Model):
    select_sub_list = models.JSONField(
        null=True,
        blank=True,
        verbose_name='子任務的選擇',
        help_text='包含是否選擇子任務的 Boolean 的 Array<JSON> 格式資料'
    )

    plan_list = models.JSONField(
        null=True,
        blank=True,
        verbose_name='子任務',
        help_text='包含 strategy, description 和 time 的 Array<JSON> 格式資料'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_plans'
        verbose_name = '任務計劃設定'
        verbose_name_plural = '任務計畫設定列表'
        ordering = ['-created_at']
