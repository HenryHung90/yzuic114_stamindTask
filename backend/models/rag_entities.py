from django.db import models
from django.contrib.postgres.fields import ArrayField


class RagEntities(models.Model):
    """
    RAG 實體模型
    用於存儲知識圖譜中的實體及其屬性
    """

    # 主鍵
    id = models.UUIDField(
        primary_key=True,
        verbose_name='實體ID'
    )

    task = models.ForeignKey(
        'Task',
        on_delete=models.SET_NULL,
        related_name='task_rag_entity',
        null=True,
        blank=True,
        verbose_name="所屬課程"
    )

    # 人類可讀的 ID
    human_readable_id = models.IntegerField(
        verbose_name='可讀ID',
        db_index=True,
        unique=True
    )

    # 實體基本資訊
    title = models.CharField(
        max_length=500,
        verbose_name='標題',
        db_index=True
    )

    type = models.CharField(
        max_length=100,
        verbose_name='類型',
        db_index=True,
        blank=True,
        null=True
    )

    description = models.TextField(
        verbose_name='描述',
        blank=True,
        null=True
    )

    # 關聯的文本單元 ID 列表
    text_unit_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='文本單元ID列表',
        blank=True,
        default=list
    )

    # 統計資訊
    frequency = models.IntegerField(
        verbose_name='頻率',
        default=0,
        db_index=True,
        help_text='實體出現的頻率'
    )

    degree = models.IntegerField(
        verbose_name='度數',
        default=0,
        db_index=True,
        help_text='實體在圖中的連接度數'
    )

    # 圖形位置座標
    x = models.FloatField(
        verbose_name='X座標',
        null=True,
        blank=True
    )

    y = models.FloatField(
        verbose_name='Y座標',
        null=True,
        blank=True
    )

    # 時間戳
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='創建時間'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='更新時間'
    )

    class Meta:
        db_table = 'rag_entities'
        verbose_name = 'RAG實體'
        verbose_name_plural = 'RAG實體'
        ordering = ['human_readable_id']
        indexes = [
            models.Index(fields=['task', 'human_readable_id'], name='entity_task_human_idx'),
        ]

    def __str__(self):
        return f"{self.title} ({self.type})"

    def get_text_unit_count(self):
        """獲取關聯文本單元數量"""
        return len(self.text_unit_ids) if self.text_unit_ids else 0

    def get_position(self):
        """獲取座標位置"""
        if self.x is not None and self.y is not None:
            return (self.x, self.y)
        return None
