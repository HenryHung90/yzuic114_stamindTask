from django.db import models
from django.contrib.postgres.fields import ArrayField


class RagRelationships(models.Model):
    """
    RAG 關係模型
    用於存儲知識圖譜中實體之間的關係
    """

    # 主鍵
    id = models.UUIDField(
        primary_key=True,
        verbose_name='關係ID'
    )

    # 人類可讀的 ID
    human_readable_id = models.IntegerField(
        verbose_name='可讀ID',
        db_index=True,
        unique=True
    )

    # 關係的源實體和目標實體
    source = models.CharField(
        max_length=500,
        verbose_name='源實體',
        db_index=True
    )

    target = models.CharField(
        max_length=500,
        verbose_name='目標實體',
        db_index=True
    )

    # 關係描述
    description = models.TextField(
        verbose_name='關係描述',
        blank=True,
        null=True
    )

    # 權重和度數
    weight = models.FloatField(
        verbose_name='權重',
        default=0.0,
        db_index=True,
        help_text='關係的權重或強度'
    )

    combined_degree = models.IntegerField(
        verbose_name='組合度數',
        default=0,
        db_index=True,
        help_text='源實體和目標實體的組合度數'
    )

    # 關聯的文本單元 ID 列表
    text_unit_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='文本單元ID列表',
        blank=True,
        default=list
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
        db_table = 'rag_relationships'
        verbose_name = 'RAG關係'
        verbose_name_plural = 'RAG關係'
        ordering = ['human_readable_id']

    def __str__(self):
        return f"{self.source} → {self.target}"

    def get_text_unit_count(self):
        """獲取關聯文本單元數量"""
        return len(self.text_unit_ids) if self.text_unit_ids else 0

    def get_relationship_strength(self):
        """獲取關係強度（基於權重和度數）"""
        return {
            'weight': self.weight,
            'combined_degree': self.combined_degree,
            'strength_score': self.weight * self.combined_degree
        }
