import time

from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
import pandas as pd
import json
import uuid
import math

from backend.models.rag_entities import RagEntities
from backend.models.rag_relationships import RagRelationships
from backend.models.rag_communities import RagCommunities
from backend.models.rag_summaries import RagSummaries
from backend.models.rag_sources import RagSources

from backend.serializers.rag_entities_serializer import RagEntitiesSerializer
from backend.serializers.rag_relationships_serializer import RagRelationshipsSerializer
from backend.serializers.rag_communities_serializer import RagCommunitiesSerializer
from backend.serializers.rag_summaries_serializer import RagSummariesSerializer
from backend.serializers.rag_sources_serializer import RagSourcesSerializer

GRAPHRAG_TYPE_MAPPING = {
    'Entitie': {
        'model': RagEntities,
        'serializer': RagEntitiesSerializer,
    },
    'Relationship': {
        'model': RagRelationships,
        'serializer': RagRelationshipsSerializer,
    },
    'Community': {
        'model': RagCommunities,
        'serializer': RagCommunitiesSerializer,
    },
    'Report': {
        'model': RagSummaries,
        'serializer': RagSummariesSerializer,
    },
    'Source': {
        'model': RagSources,
        'serializer': RagSourcesSerializer,
    }
}

# 輔助函數：處理數組字段
def parse_array_field(value, item_type=int):
    """
    將字符串表示的數組轉換為Python列表

    :param value: 要轉換的值（可能是字符串、列表或None）
    :param item_type: 數組元素類型（int或str）
    :return: 轉換後的Python列表
    """
    if value is None:
        return []

    if isinstance(value, list):
        # 已經是列表，確保元素類型正確
        return [item_type(item) for item in value if item is not None]

    if isinstance(value, str):
        # 嘗試解析字符串表示的列表
        if value.strip() in ('[]', ''):
            return []

        try:
            # 嘗試解析JSON格式
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [item_type(item) for item in parsed if item is not None]
        except:
            # 如果不是有效的JSON，嘗試其他格式
            try:
                # 處理類似 "[1,2,3]" 的字符串
                if value.startswith('[') and value.endswith(']'):
                    items = value[1:-1].split(',')
                    return [item_type(item.strip()) for item in items if item.strip()]
                # 處理類似 "1,2,3" 的字符串
                else:
                    items = value.split(',')
                    return [item_type(item.strip()) for item in items if item.strip()]
            except:
                # 如果無法解析，返回空列表
                return []

    # 如果是其他類型，返回空列表
    return []


# 輔助函數：處理JSON字段
def parse_json_field(value, default=None):
    """
    將字符串轉換為JSON對象

    :param value: 要轉換的值（可能是字符串、字典或None）
    :param default: 默認值，如果無法解析則返回此值
    :return: 轉換後的JSON對象
    """
    if default is None:
        default = {}

    if value is None:
        return default

    if isinstance(value, (dict, list)):
        # 已經是字典或列表，直接返回
        return value

    if isinstance(value, str):
        try:
            # 嘗試解析JSON格式
            return json.loads(value)
        except:
            # 如果無法解析，返回默認值
            return default

    # 如果是其他類型，返回默認值
    return default


# get task GraphRag Info
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_graphrag_info(request):
    try:
        task_id = request.data.get('task_id')
        # 獲取該任務的所有RAG相關資訊
        entities = RagEntities.objects.filter(task_id=task_id)
        relationships = RagRelationships.objects.filter(task_id=task_id)
        communities = RagCommunities.objects.filter(task_id=task_id)
        summaries = RagSummaries.objects.filter(task_id=task_id)
        sources = RagSources.objects.filter(task_id=task_id)

        # 使用序列化器將數據轉換為JSON格式
        entities_serializer = RagEntitiesSerializer(entities, many=True)
        relationships_serializer = RagRelationshipsSerializer(relationships, many=True)
        communities_serializer = RagCommunitiesSerializer(communities, many=True)
        summaries_serializer = RagSummariesSerializer(summaries, many=True)
        sources_serializer = RagSourcesSerializer(sources, many=True)

        # 整理資料為JSON格式返回
        response_data = {
            'entities': entities_serializer.data,
            'relationships': relationships_serializer.data,
            'communities': communities_serializer.data,
            'summaries': summaries_serializer.data,
            'sources': sources_serializer.data,
            'data_count': {
                'entity_count': entities.count(),
                'relationship_count': relationships.count(),
                'community_count': communities.count(),
                'summary_count': summaries.count(),
                'source_count': sources.count()
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'get tasks graphrag info Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# upload GraphRag file
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_graphrag_file(request):
    try:
        # 獲取請求中的參數
        file_type = request.data.get('fileType')
        task_id = request.data.get('taskId')
        file = request.data.get('file')

        if not file or not file_type or not task_id:
            return Response({'message': '缺少必要參數'}, status=status.HTTP_400_BAD_REQUEST)

        # 檢查文件類型
        if not file.name.endswith('.csv'):
            return Response({'message': '只支持CSV文件格式'}, status=status.HTTP_400_BAD_REQUEST)

        # 處理CSV文件
        try:
            # 使用pandas讀取CSV文件
            df = pd.read_csv(file)

            # 根據文件類型處理不同的數據模型
            if file_type == 'Communities':
                # 刪除當前任務的已有數據
                RagCommunities.objects.filter(task_id=task_id).delete()

                # 將新數據導入
                for index, row in df.iterrows():
                    # 處理ID欄位，如果沒有則生成新的UUID
                    record_id = row.get('id')
                    if not record_id:
                        record_id = str(uuid.uuid4())

                    # 正確處理數組欄位
                    children = parse_array_field(row.get('children'), int)
                    entity_ids = parse_array_field(row.get('entity_ids'), str)
                    relationship_ids = parse_array_field(row.get('relationship_ids'), str)
                    text_unit_ids = parse_array_field(row.get('text_unit_ids'), str)

                    community = RagCommunities(
                        id=record_id,
                        task_id=task_id,
                        human_readable_id=int(row.get('human_readable_id', 0)),
                        community=int(row.get('community', 0)),
                        level=int(row.get('level', 0)),
                        parent=int(row.get('parent', -1)),
                        children=children,
                        title=str(row.get('title', '')),
                        entity_ids=entity_ids,
                        relationship_ids=relationship_ids,
                        text_unit_ids=text_unit_ids,
                        size=int(row.get('size', 0)),
                        created_at=timezone.now(),  # 設置為當前時間
                        # period字段需要特殊處理，这里先不设置，如需處理可添加
                    )
                    community.save()

                return Response({
                    'message': f'成功上傳 Communities 文件，共導入 {len(df)} 筆數據',
                    'count': len(df)
                }, status=status.HTTP_200_OK)

            elif file_type == 'Entities':
                # 刪除當前任務的已有數據
                RagEntities.objects.filter(task_id=task_id).delete()

                # 將新數據導入
                for index, row in df.iterrows():
                    # 處理ID欄位
                    record_id = row.get('id')
                    if not record_id:
                        record_id = str(uuid.uuid4())

                    # 處理ArrayField
                    text_unit_ids = parse_array_field(row.get('text_unit_ids'), str)

                    entity = RagEntities(
                        id=record_id,
                        task_id=task_id,
                        human_readable_id=int(row.get('human_readable_id', 0)),
                        title=str(row.get('title', '')),
                        type=str(row.get('type', '')),
                        description=str(row.get('description', '')),
                        text_unit_ids=text_unit_ids,
                        frequency=int(row.get('frequency', 0)),
                        degree=int(row.get('degree', 0)),
                        created_at=timezone.now(),  # 設置為當前時間
                    )
                    entity.save()

                return Response({
                    'message': f'成功上傳 Entities 文件，共導入 {len(df)} 筆數據',
                    'count': len(df)
                }, status=status.HTTP_200_OK)

            elif file_type == 'Relationships':
                # 刪除當前任務的已有數據
                RagRelationships.objects.filter(task_id=task_id).delete()

                # 將新數據導入
                for index, row in df.iterrows():
                    # 處理ID欄位
                    record_id = row.get('id')
                    if not record_id:
                        record_id = str(uuid.uuid4())

                    # 處理ArrayField
                    text_unit_ids = parse_array_field(row.get('text_unit_ids'), str)

                    relationship = RagRelationships(
                        id=record_id,
                        task_id=task_id,
                        human_readable_id=int(row.get('human_readable_id', 0)),
                        source=str(row.get('source', '')),
                        target=str(row.get('target', '')),
                        description=str(row.get('description', '')),
                        weight=float(row.get('weight', 0.0)),
                        combined_degree=int(row.get('combined_degree', 0)),
                        text_unit_ids=text_unit_ids,
                        created_at=timezone.now(),  # 設置為當前時間
                    )
                    relationship.save()

                return Response({
                    'message': f'成功上傳 Relationships 文件，共導入 {len(df)} 筆數據',
                    'count': len(df)
                }, status=status.HTTP_200_OK)

            elif file_type == 'Sources':
                # 刪除當前任務的已有數據
                RagSources.objects.filter(task_id=task_id).delete()

                # 將新數據導入
                for index, row in df.iterrows():
                    # 處理ID欄位
                    record_id = row.get('id')
                    if not record_id:
                        record_id = str(uuid.uuid4())

                    # 處理ArrayField
                    document_ids = parse_array_field(row.get('document_ids'), str)
                    entity_ids = parse_array_field(row.get('entity_ids'), str)
                    relationship_ids = parse_array_field(row.get('relationship_ids'), str)
                    covariate_ids = parse_array_field(row.get('covariate_ids'), str)

                    source = RagSources(
                        id=record_id,
                        task_id=task_id,
                        human_readable_id=int(row.get('human_readable_id', 0)),
                        text=str(row.get('text', '')),
                        n_tokens=int(row.get('n_tokens', 0)),
                        document_ids=document_ids,
                        entity_ids=entity_ids,
                        relationship_ids=relationship_ids,
                        covariate_ids=covariate_ids,
                        created_at=timezone.now(),  # 設置為當前時間
                    )
                    source.save()

                return Response({
                    'message': f'成功上傳 Sources 文件，共導入 {len(df)} 筆數據',
                    'count': len(df)
                }, status=status.HTTP_200_OK)

            elif file_type == 'Summaries':
                # 刪除當前任務的已有數據
                RagSummaries.objects.filter(task_id=task_id).delete()

                # 將新數據導入
                for index, row in df.iterrows():
                    # 處理ID欄位
                    record_id = row.get('id')
                    if not record_id:
                        record_id = str(uuid.uuid4())

                    # 處理ArrayField
                    children = parse_array_field(row.get('children'), int)

                    # 處理JSONField
                    findings = parse_json_field(row.get('findings'), [])
                    full_content_json = parse_json_field(row.get('full_content_json'))

                    summary = RagSummaries(
                        id=record_id,
                        task_id=task_id,
                        human_readable_id=int(row.get('human_readable_id', 0)),
                        community=int(row.get('community', 0)),
                        level=int(row.get('level', 0)),
                        parent=int(row.get('parent', -1)) if row.get('parent') is not None else None,
                        children=children,
                        title=str(row.get('title', '')),
                        summary=str(row.get('summary', '')),
                        full_content=str(row.get('full_content', '')),
                        rank=float(row.get('rank', 0.0)),
                        rating_explanation=str(row.get('rating_explanation', '')),
                        findings=findings,
                        full_content_json=full_content_json,
                        size=int(row.get('size', 0)) if row.get('size') is not None else None,
                        created_at=timezone.now(),  # 設置為當前時間
                        # period字段需要特殊處理，这里先不设置
                    )
                    summary.save()

                return Response({
                    'message': f'成功上傳 Summaries 文件，共導入 {len(df)} 筆數據',
                    'count': len(df)
                }, status=status.HTTP_200_OK)

            else:
                return Response({'message': f'不支持的文件類型: {file_type}'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'message': f'處理CSV文件時出錯: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'message': f'上傳文件失敗: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


# 簡化後的函數
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_graphrag_detail_by_type_and_id(request):
    try:
        task_id = request.data.get('task_id')
        record_type = request.data.get('type')
        record_id = request.data.get('id')

        if not record_type or not record_id:
            return Response({'message': '缺少必要參數'}, status=status.HTTP_400_BAD_REQUEST)

        # 檢查類型是否支持
        if record_type not in GRAPHRAG_TYPE_MAPPING:
            return Response({'message': f'不支持的類型: {record_type}'}, status=status.HTTP_400_BAD_REQUEST)

        # 獲取對應的配置
        config = GRAPHRAG_TYPE_MAPPING[record_type]

        # 查詢記錄
        record = config['model'].objects.filter(
            human_readable_id=record_id,
            task_id=task_id
        ).first()

        if not record:
            return Response({'message': "找不到對應關係"}, status=status.HTTP_404_NOT_FOUND)

        # 序列化並返回
        serializer = config['serializer'](record)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'message': f'獲取詳情失敗: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
