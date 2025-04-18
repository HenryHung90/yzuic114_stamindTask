import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import ClassName, StudentRecord

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# save student note
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_student_records(request):
    try:
        student_records = request.data.get('student_records')
        class_name = ClassName.objects.get(name=request.user.class_name)

        user = request.user
        records_to_create = []
        errors = []
        # 處理每一筆記錄(若為 str 表示從 Beacon 寄送，需轉為 json)
        if type(student_records) == str:
            student_records = json.loads(student_records)

        for idx, record_data in enumerate(student_records):
            try:
                # 驗證必要欄位
                required_fields = ['verb', 'time', 'objectType', 'objectName', 'objectId']
                for field in required_fields:
                    if field not in record_data:
                        raise ValueError(f"Missing required field: {field}")


                # 建立記錄物件
                record = StudentRecord(
                    user=user,
                    class_name=class_name,
                    verb=record_data['verb'],
                    time=record_data['time'],
                    timer=record_data['timer'],
                    object_type=record_data['objectType'],
                    object_name=record_data['objectName'],
                    object_id=record_data['objectId'],
                    context=record_data.get('context', {})
                )
                records_to_create.append(record)

            except Exception as e:
                # 如果某一筆記錄有錯誤，記錄下來並繼續處理其他記錄
                errors.append({'index': idx, 'error': str(e)})

        # 批量儲存記錄
        if records_to_create:
            StudentRecord.objects.bulk_create(records_to_create)

        # 回應結果
        response_data = {
            'message': 'Records processed successfully',
            'saved_records': len(records_to_create),
            'errors': errors
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f'save student records Error: {e}')
        return Response({'save student records Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
