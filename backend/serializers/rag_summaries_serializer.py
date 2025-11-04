from rest_framework import serializers
from backend.models.rag_summaries import RagSummaries


class RagSummariesSerializer(serializers.ModelSerializer):
    """RAG摘要序列化器"""
    findings_count = serializers.SerializerMethodField()

    class Meta:
        model = RagSummaries
        fields = [
            'id', 'human_readable_id', 'community', 'level', 'parent',
            'children', 'title', 'summary', 'full_content', 'rank',
            'rating_explanation', 'findings', 'full_content_json',
            'period', 'size', 'findings_count'
        ]

    def get_findings_count(self, obj):
        return obj.get_findings_count()
