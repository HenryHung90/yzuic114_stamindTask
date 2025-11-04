from rest_framework import serializers
from backend.models.rag_entities import RagEntities


class RagEntitiesSerializer(serializers.ModelSerializer):
    """RAG實體序列化器"""
    position = serializers.SerializerMethodField()

    class Meta:
        model = RagEntities
        fields = [
            'id', 'human_readable_id', 'title', 'type', 'description',
            'text_unit_ids', 'frequency', 'degree', 'position'
        ]

    def get_position(self, obj):
        """獲取座標位置"""
        if obj.x is not None and obj.y is not None:
            return {'x': obj.x, 'y': obj.y}
        return None
