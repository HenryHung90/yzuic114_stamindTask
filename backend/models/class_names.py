from django.db import models


class ClassName(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='班級名稱',
        unique=True,
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "班級"
        verbose_name_plural = "班級列表"
        ordering = ['name']

    def __str__(self):
        return self.name