from rest_framework import serializers
from backend.models.rag_relationships import RagRelationships


class RagRelationshipsSerializer(serializers.ModelSerializer):
    """RAG關係序列化器"""
    strength = serializers.SerializerMethodField()

    class Meta:
        model = RagRelationships
        fields = [
            'id', 'human_readable_id', 'source', 'target', 'description',
            'weight', 'combined_degree', 'text_unit_ids', 'strength'
        ]

    def get_strength(self, obj):
        """獲取關係強度"""
        return {
            'weight': obj.weight,
            'combined_degree': obj.combined_degree,
            'strength_score': obj.weight * obj.combined_degree
        }
