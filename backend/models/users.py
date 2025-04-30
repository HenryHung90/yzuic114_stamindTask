from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


class CustomUserManager(UserManager):
    def create_user(self, student_id, password=None, **extra_fields):
        """
        建立並保存一個新的使用者
        """
        if not student_id:
            raise ValueError('使用者必須要有學號/教師編號')

        # 確保移除 username 參數
        extra_fields.pop('username', None)
        extra_fields.pop('first_name', None)
        extra_fields.pop('last_name', None)

        user = self.model(
            student_id=student_id,
            **extra_fields
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, student_id, password=None, **extra_fields):
        """
        建立並保存一個超級使用者
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(student_id, password, **extra_fields)


class User(AbstractUser):
    # 將 username 改為 student_id
    username = None  # 停用原本的 username
    first_name = None
    last_name = None
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

    student_group = models.ForeignKey(
        'StudentGroup',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name="學生組別"
    )

    student_note = models.OneToOneField(
        'StudentNote',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        verbose_name='學生筆記內容'
    )

    # 時間戳記
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 設定 student_id 為主要識別欄位
    # 取代 username 欄位
    objects = CustomUserManager()  # 使用自定義的 Manager
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
