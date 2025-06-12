from django.db import models
from django.utils import timezone


class LoginAttempt(models.Model):
    ip_address = models.GenericIPAddressField()
    student_id = models.CharField(max_length=100, blank=True, null=True)
    success = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)
    blocked_until = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'login_attempts'
        verbose_name = '登入存取'
        verbose_name_plural = '登入存取列表'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.ip_address} - {self.student_id} - {'成功' if self.success else '失敗'}"
