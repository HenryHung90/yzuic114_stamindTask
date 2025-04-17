from django.db import models


class ProcessHints(models.Model):
    hints = models.JSONField(
        null=True,
        blank=True,
        verbose_name="計劃執行 JSON 格式"
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'process_hints'
        verbose_name = "計劃執行提示"
        verbose_name_plural = "計劃執行提示列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.task.name} - {self.hints}"
