from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # 將 username 改為 student_id
    username = None  # 停用原本的 username
    student_id = models.CharField(
        max_length=50,
        unique=True,
        primary_key=True,
        verbose_name="學號/教師編號"
    )

    class UserType(models.TextChoices):
        TEACHER = 'TEACHER', '教師'
        STUDENT = 'STUDENT', '學生'

    # 自定義欄位
    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.STUDENT,
        verbose_name="使用者類型"
    )
    name = models.CharField(
        max_length=100,
        help_text="姓名"
    )

    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        related_name='users',
        null=True,
        blank=True,
        verbose_name="班級"
    )

    # 關聯欄位
    chat_history = models.OneToOneField(
        'ChatHistory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        verbose_name="聊天紀錄"
    )

    student_group = models.ForeignKey(
        'StudentGroup',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        verbose_name="學生組別"
    )

    student_record = models.OneToOneField(
        'StudentRecord',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        verbose_name='學生操作記錄'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 設定 student_id 為主要識別欄位
    # 取代 username 欄位
    USERNAME_FIELD = 'student_id'
    # create superuser 時會要求填寫
    REQUIRED_FIELDS = ['name', 'user_type']
    # 添加 related_name 來解決衝突
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_group_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to.'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_permission_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.'
    )

    class Meta:
        # table 名稱
        db_table = 'users'
        # 單數名稱
        verbose_name = 'user'
        # 複數名稱
        verbose_name_plural = 'users'

        ordering = ['-class_name', 'student_id']
        # student_id & class_name 唯一限制
        constraints = [
            models.UniqueConstraint(
                fields=['student_id', 'class_name'],
                name='unique_student_id_and_class_name'  # 約束名稱
            )
        ]

    # 當物件被轉換為字串時的表示方式
    def __str__(self):
        return f"{self.name} - {self.class_name.name} - {self.student_id}"
