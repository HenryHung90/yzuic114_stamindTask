from django.db import models


class StudentTaskProcessCode(models.Model):
    html_code = models.TextField(
        blank=True,
        verbose_name='HTML 程式'
    )

    js_code = models.TextField(
        default='// Write your JavaScript Code here',
        blank=True,
        verbose_name='JavaScript 程式'
    )

    css_code = models.TextField(
        default='/* Write you css code here */',
        blank=True,
        verbose_name='CSS 程式'
    )

    code_history = models.JSONField(
        blank=True,
        null=True,
        default=dict,
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_task_process_code'
        verbose_name = '計劃執行程式'
        verbose_name_plural = '計劃執行程式列表'
        ordering = ['-created_at']
