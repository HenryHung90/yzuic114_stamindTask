from django.db import models

class ReflectionQuestion(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='反思題目名稱'
    )

    questions = models.JSONField(
        null=True,
        blank=True,
        verbose_name="反思回饋 JSON 格式"
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reflection_questions'
        verbose_name = "反思題目"
        verbose_name_plural = "反思題目列表"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.name}"
