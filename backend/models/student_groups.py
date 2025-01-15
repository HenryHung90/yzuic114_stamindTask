from django.db import models

class StudentGroup(models.Model):
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='student_groups',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    class GroupType(models.TextChoices):
        EXPERIMENTAL = 'EXPERIMENTAL', '實驗組'
        CONTROL = 'CONTROL', '對照組'

    group_type = models.CharField(
        max_length=20,
        choices=GroupType.choices,
        default=GroupType.EXPERIMENTAL,
        verbose_name='組別類型'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_groups'
        verbose_name = "學生群組"
        verbose_name_plural = "學生群組列表"
        ordering = ['class_name', 'group_type']
        # 確保同一個班級不會有重複的群組類型
        unique_together = ['class_name', 'group_type']

    def __str__(self):
        return f"{self.class_name.name} - {self.group_type} - {self.users.count()}"