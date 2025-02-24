from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import Task, Experience

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""

# get Task Experience
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_experience(request):
    try:
        task_id = request.data.get('task_id')

        task_data = Task.objects.get(id=task_id)
        experience_data = task_data.experience.content

        return Response({'experience_info': experience_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)