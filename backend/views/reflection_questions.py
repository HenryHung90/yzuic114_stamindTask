from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import Task

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# get Reflection Questions
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_reflection_questions(request):
    try:
        task_id = request.data.get('task_id')

        reflection_question_data = Task.objects.get(id=task_id).reflection_question

        return Response({
            'reflection_question_list': reflection_question_data.questions
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get reflection questions Error: {e}')
        return Response({'get reflection questions Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# save Reflection Questions
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_reflection_questions(request):
    try:
        task_id = request.data.get('task_id')
        select_node = int(request.data.get('select_node'))
        questions = request.data.get('questions')

        reflection_question_data = Task.objects.get(id=task_id).reflection_question

        questions_data = [] if reflection_question_data.questions is None else reflection_question_data.questions

        if len(questions_data) > select_node:
            questions_data[select_node] = questions
        else:
            for i in range(len(questions_data), select_node + 1):
                if i == select_node:
                    questions_data.append(questions)
                else:
                    questions_data.append('empty')

        reflection_question_data.questions = questions_data
        reflection_question_data.save()
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload task target Error: {e}')
        return Response({'upload task target Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
