from rest_framework import serializers
from backend.models.rag_sources import RagSources


class RagSourcesSerializer(serializers.ModelSerializer):
    """RAG源文本序列化器"""
    document_count = serializers.SerializerMethodField()
    entity_count = serializers.SerializerMethodField()
    relationship_count = serializers.SerializerMethodField()
    covariate_count = serializers.SerializerMethodField()

    class Meta:
        model = RagSources
        fields = [
            'id', 'human_readable_id', 'text', 'n_tokens',
            'document_ids', 'entity_ids', 'relationship_ids', 'covariate_ids',
            'document_count', 'entity_count', 'relationship_count', 'covariate_count'
        ]

    def get_document_count(self, obj):
        return obj.get_document_count()

    def get_entity_count(self, obj):
        return obj.get_entity_count()

    def get_relationship_count(self, obj):
        return obj.get_relationship_count()

    def get_covariate_count(self, obj):
        return obj.get_covariate_count()
