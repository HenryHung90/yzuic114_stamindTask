from django.db import models


class Task(models.Model):
    name = models.CharField(
        max_length=120,
        verbose_name='任務名稱'
    )

    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="班級",
        related_name='tasks'
    )

    is_open = models.BooleanField(
        default=True,
        verbose_name='是否開放'
    )

    experience = models.OneToOneField(
        'Experience',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='體驗任務',
        help_text='該任務的完整內容體驗',
        related_name='task'
    )

    text_book = models.OneToOneField(
        'TextBook',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='任務教材',
        help_text='該任務的完整教材',
        related_name='task'
    )

    reflection_question = models.OneToOneField(
        'ReflectionQuestion',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='反思題目',
        help_text='該任務的反思題目',
        related_name='task'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks'
        verbose_name = '教師發布任務'
        verbose_name_plural = '教師發布的任務，學生依據內容領取'
        # student_id & class_name 唯一限制
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.class_name.name} - {self.name}"
