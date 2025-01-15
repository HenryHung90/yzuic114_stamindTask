from django.db import models


class StudentTask(models.Model):
    student = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='exams',
        verbose_name='歸屬學生'
    )

    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_tasks',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    task = models.ForeignKey(
        'Task',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='任務',
        related_name='student_task'
    )

    # task 相關內容
    plan = models.OneToOneField(
        'StudentTaskPlan',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='學習計畫',
        help_text='學生的學習計畫',
        related_name='student_task'
    )

    process = models.OneToOneField(
        'StudentTaskProcess',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='學習過程',
        help_text='學生自行紀錄學習過程紀錄',
        related_name='student_task'
    )

    reflection = models.OneToOneField(
        'StudentTaskReflection',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='學習反思',
        help_text='學生對自我的學習反思',
        related_name='student_task'
    )

    feedback = models.OneToOneField(
        'Feedback',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='教師回饋',
        help_text='老師與學生之間的回饋訊息',
        related_name='student_task'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_tasks'
        verbose_name = '學生任務'
        verbose_name_plural = '學生根據任務列表取得的任務內容'
        # student_id & class_name 唯一限制
        constraints = [
            models.UniqueConstraint(
                fields=['student_id', 'class_name', 'task'],
                name='unique_student_id_and_class_name_and_task'  # 約束名稱
            )
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"學生 {self.student.name} - {self.class_name.name} - 任務 {self.task.name}"