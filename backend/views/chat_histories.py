from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import User


# get Chat Histories
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_histories(request):
    try:
        offset = request.data.get('offset')

        chat_history_data = User.objects.get(student_id=request.user.student_id).chat_history

        if chat_history_data is None or chat_history_data is []:
            return Response({'messages': 'empty'}, status=status.HTTP_200_OK)
        else:
            chat_history_data = chat_history_data.chat_history

        if offset > len(chat_history_data):
            return Response({'messages': 'empty'}, status=status.HTTP_200_OK)

        start = max(-len(chat_history_data), -offset - 10)  # 保證不超出範圍
        end = -offset if offset <= len(chat_history_data) else None  # 如果 offset 超出範圍，取到最後
        offset_data = chat_history_data[start:end] if end != 0 else chat_history_data[-10:]

        res_messages = []
        for history in offset_data:
            modify_message = {
                "time": history["time"],
                "message": history["message"],
                "studentId": history["student_id"],
                "name": history["name"],
            }
            res_messages.append(modify_message)

        return Response({'messages': res_messages}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get Chat Histories Error: {e}')
        return Response({'get Chat Histories Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# get Chat Histories
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_chat_histories_by_student_id(request):
    try:
        student_id = request.data.get('student_id')

        chat_history_data = User.objects.get(student_id=student_id).chat_history

        if chat_history_data is None or chat_history_data is []:
            return Response({'messages': 'empty'}, status=status.HTTP_204_NO_CONTENT)
        else:
            chat_history_data = chat_history_data.chat_history

        res_messages = []
        for history in chat_history_data:
            modify_message = {
                "time": history["time"],
                "message": history["message"],
                "studentId": history["student_id"],
                "name": history["name"],
            }
            res_messages.append(modify_message)

        return Response({'chat_history': res_messages}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get Chat Histories by Student Id Error: {e}')
        return Response({'get Chat Histories by Student Id Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)