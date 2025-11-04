from rest_framework import serializers
from backend.models.rag_communities import RagCommunities


class RagCommunitiesSerializer(serializers.ModelSerializer):
    """RAG社群序列化器"""
    is_root = serializers.SerializerMethodField()
    has_children = serializers.SerializerMethodField()
    entity_count = serializers.SerializerMethodField()
    relationship_count = serializers.SerializerMethodField()
    text_unit_count = serializers.SerializerMethodField()

    class Meta:
        model = RagCommunities
        fields = [
            'id', 'human_readable_id', 'community', 'level', 'parent',
            'children', 'title', 'entity_ids', 'relationship_ids',
            'text_unit_ids', 'period', 'size', 'is_root', 'has_children',
            'entity_count', 'relationship_count', 'text_unit_count'
        ]

    def get_is_root(self, obj):
        return obj.is_root()

    def get_has_children(self, obj):
        return obj.has_children()

    def get_entity_count(self, obj):
        return obj.get_entity_count()

    def get_relationship_count(self, obj):
        return obj.get_relationship_count()

    def get_text_unit_count(self, obj):
        return obj.get_text_unit_count()
