from django.contrib.postgres.fields import ArrayField
from django.db import models

class Target(models.Model):
    name = models.CharField(
        max_length=120,
        verbose_name='目標名稱'
    )

    target = models.CharField(
        max_length=120,
        null=True,
        blank=True,
        verbose_name='目標名稱'
    )

    description = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name='目標描述'
    )

    sub_target_list = ArrayField(
        models.CharField(max_length=500),
        default=list,
        null=True,
        blank=True,
        verbose_name='子任務'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'targets'
        verbose_name = "目標"
        verbose_name_plural = "目標列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.name}"
