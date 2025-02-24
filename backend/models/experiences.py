from django.db import models


class Experience(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='體驗任務名稱'
    )

    content = models.JSONField(
        default=dict,
        null=True,
        blank=True,
        verbose_name='體驗任務內容'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'experiences'
        verbose_name = "體驗任務"
        verbose_name_plural = "體驗任務列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name} - {self.name}"
