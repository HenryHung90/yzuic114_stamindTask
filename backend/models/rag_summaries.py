from django.db import models
from django.contrib.postgres.fields import ArrayField


class RagSummaries(models.Model):
    """
    RAG 社群報告摘要模型
    用於存儲社群分析報告及其發現
    """

    # 主鍵
    id = models.CharField(
        max_length=255,
        primary_key=True,
        verbose_name='報告ID'
    )

    # 人類可讀的 ID
    human_readable_id = models.IntegerField(
        verbose_name='可讀ID',
        db_index=True,
        unique=True
    )

    # 社群和層級資訊
    community = models.IntegerField(
        verbose_name='社群編號',
        db_index=True
    )

    level = models.IntegerField(
        verbose_name='層級',
        db_index=True
    )

    parent = models.IntegerField(
        verbose_name='父層級',
        null=True,
        blank=True
    )

    children = ArrayField(
        models.IntegerField(),
        verbose_name='子層級列表',
        blank=True,
        default=list
    )

    # 報告內容
    title = models.CharField(
        max_length=500,
        verbose_name='標題'
    )

    summary = models.TextField(
        verbose_name='摘要'
    )

    full_content = models.TextField(
        verbose_name='完整內容'
    )

    # 評分資訊
    rank = models.FloatField(
        verbose_name='排名分數',
        db_index=True
    )

    rating_explanation = models.TextField(
        verbose_name='評分說明'
    )

    # 發現 (JSON 格式存儲)
    findings = models.JSONField(
        verbose_name='發現列表',
        default=list
    )

    full_content_json = models.JSONField(
        verbose_name='完整內容JSON',
        null=True,
        blank=True
    )

    # 元數據
    period = models.DateField(
        verbose_name='期間',
        null=True,
        blank=True
    )

    size = models.IntegerField(
        verbose_name='大小',
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
        db_table = 'rag_summaries'
        verbose_name = 'RAG社群摘要'
        verbose_name_plural = 'RAG社群摘要'
        ordering = ['-rank', 'human_readable_id']

    def __str__(self):
        return f"Community {self.community}: {self.title}"

    def get_findings_count(self):
        """獲取發現數量"""
        return len(self.findings) if self.findings else 0
