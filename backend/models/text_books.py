from django.db import models


class TextBook(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='教材名稱'
    )

    content = models.JSONField(
        default=dict,
        null=True,
        blank=True,
        verbose_name='教材內容'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'text_books'
        verbose_name = "教材"
        verbose_name_plural = "教材列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.name}"
