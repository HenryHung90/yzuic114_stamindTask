from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import User, StudentNote

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# get student note
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_student_note(request):
    try:
        student_data = User.objects.get(student_id=request.user.student_id)


        if student_data.student_note is None:
            with transaction.atomic():
                new_student_note = StudentNote.objects.create()
                student_data.student_note = new_student_note
                new_student_note.save()
                student_data.save()
            return Response({'student_note': 'empty'}, status=status.HTTP_200_OK)
        else:
            return Response({'student_note': student_data.student_note.notes}, status=status.HTTP_200_OK)


    except Exception as e:
        print(f'get student note Error: {e}')
        return Response({'get student note Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# save student note
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_student_note(request):
    try:
        note_data = request.data.get('student_notes')
        student_note_data = User.objects.get(student_id=request.user.student_id).student_note
        student_note_data.notes = note_data
        student_note_data.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'save student note Error: {e}')
        return Response({'save student note Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
