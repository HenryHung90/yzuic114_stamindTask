from django.db import models
from django.contrib.postgres.fields import ArrayField


class RagCommunities(models.Model):
    """
    RAG 社群模型
    用於存儲知識圖譜中的社群結構和層級關係
    """

    # 主鍵
    id = models.UUIDField(
        primary_key=True,
        verbose_name='社群ID'
    )

    task = models.ForeignKey(
        'Task',
        on_delete=models.SET_NULL,
        related_name='task_rag_community',
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

    # 社群編號
    community = models.IntegerField(
        verbose_name='社群編號',
        db_index=True,
        help_text='社群的唯一編號'
    )

    # 層級資訊
    level = models.IntegerField(
        verbose_name='層級',
        default=0,
        db_index=True,
        help_text='社群在層級結構中的層級'
    )

    # 父社群
    parent = models.IntegerField(
        verbose_name='父社群',
        default=-1,
        db_index=True,
        help_text='父社群的編號，-1 表示頂層社群'
    )

    # 子社群列表
    children = ArrayField(
        models.IntegerField(),
        verbose_name='子社群列表',
        blank=True,
        default=list,
        help_text='子社群的編號列表'
    )

    # 社群標題
    title = models.CharField(
        max_length=500,
        verbose_name='標題',
        db_index=True
    )

    # 關聯的實體 ID 列表
    entity_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='實體ID列表',
        blank=True,
        default=list
    )

    # 關聯的關係 ID 列表
    relationship_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='關係ID列表',
        blank=True,
        default=list
    )

    # 關聯的文本單元 ID 列表
    text_unit_ids = ArrayField(
        models.CharField(max_length=255),
        verbose_name='文本單元ID列表',
        blank=True,
        default=list
    )

    # 時期
    period = models.DateField(
        verbose_name='時期',
        null=True,
        blank=True,
        help_text='社群的時間標記'
    )

    # 社群大小
    size = models.IntegerField(
        verbose_name='大小',
        default=0,
        db_index=True,
        help_text='社群中實體的數量'
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
        db_table = 'rag_communities'
        verbose_name = 'RAG社群'
        verbose_name_plural = 'RAG社群'
        ordering = ['level', 'community']
        indexes = [
            models.Index(fields=['task', 'human_readable_id'], name='community_task_human_idx'),
        ]

    def __str__(self):
        return f"{self.title} (Level {self.level})"

    def is_root(self):
        """判斷是否為根社群"""
        return self.parent == -1

    def has_children(self):
        """判斷是否有子社群"""
        return len(self.children) > 0 if self.children else False

    def get_entity_count(self):
        """獲取實體數量"""
        return len(self.entity_ids) if self.entity_ids else 0

    def get_relationship_count(self):
        """獲取關係數量"""
        return len(self.relationship_ids) if self.relationship_ids else 0

    def get_text_unit_count(self):
        """獲取文本單元數量"""
        return len(self.text_unit_ids) if self.text_unit_ids else 0

    def get_children_count(self):
        """獲取子社群數量"""
        return len(self.children) if self.children else 0

    @classmethod
    def get_root_communities(cls):
        """獲取所有根社群"""
        return cls.objects.filter(parent=-1)

    @classmethod
    def get_by_level(cls, level):
        """獲取指定層級的所有社群"""
        return cls.objects.filter(level=level)
