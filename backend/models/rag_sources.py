from django.db import models
from django.contrib.postgres.fields import ArrayField


class RagSources(models.Model):
    """
    RAG (Retrieval-Augmented Generation) 文本單元模型
    用於存儲文檔的分塊文本及其關聯的實體、關係和協變量
    """

    # 主鍵 - 使用 CSV 中的 id 作為唯一標識
    id = models.CharField(
        max_length=255,
        primary_key=True,
        verbose_name='文本單元ID',
        help_text='文本單元的唯一哈希標識符'
    )

    task = models.ForeignKey(
        'Task',
        on_delete=models.SET_NULL,
        related_name='task_rag_source',
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

    # 文本內容
    text = models.TextField(
        verbose_name='文本內容',
        help_text='文本單元的實際內容'
    )

    # Token 數量
    n_tokens = models.IntegerField(
        verbose_name='Token數量',
        help_text='文本的 token 計數',
        db_index=True
    )

    # 使用 PostgreSQL 的 ArrayField 存儲 ID 列表
    document_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='文檔ID列表',
        help_text='關聯的文檔ID列表',
        blank=True,
        null=True
    )

    entity_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='實體ID列表',
        help_text='關聯的實體ID列表',
        blank=True,
        null=True
    )

    relationship_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='關係ID列表',
        help_text='關聯的關係ID列表',
        blank=True,
        null=True
    )

    covariate_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='協變量ID列表',
        help_text='關聯的協變量ID列表',
        blank=True,
        null=True
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
        db_table = 'rag_sources'
        verbose_name = 'RAG文本單元'
        verbose_name_plural = 'RAG文本單元'
        ordering = ['human_readable_id']
        indexes = [
            models.Index(fields=['task', 'human_readable_id'], name='source_task_human_idx'),
        ]

    def __str__(self):
        return f"TextUnit {self.human_readable_id}: {self.text[:50]}..."

    def get_document_count(self):
        """獲取關聯文檔數量"""
        return len(self.document_ids) if self.document_ids else 0

    def get_entity_count(self):
        """獲取關聯實體數量"""
        return len(self.entity_ids) if self.entity_ids else 0

    def get_relationship_count(self):
        """獲取關聯關係數量"""
        return len(self.relationship_ids) if self.relationship_ids else 0

    def get_covariate_count(self):
        """獲取關聯協變量數量"""
        return len(self.covariate_ids) if self.covariate_ids else 0
