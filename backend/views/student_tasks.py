from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction

from backend.models import Task, StudentTask, User, StudentTaskPlan, StudentTaskProcess, \
    StudentTaskProcessCode, StudentTaskReflection, Feedback

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# init Student Task
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def init_student_task(request):
    try:
        task_id = request.data.get('task_id')

        task_data = Task.objects.get(id=task_id)
        student_task_data = task_data.student_task.filter(student_id=request.user.student_id).first()

        if student_task_data is None:
            with transaction.atomic():
                student = User.objects.get(student_id=request.user.student_id)
                class_name = task_data.class_name

                plan = StudentTaskPlan.objects.create()
                process_code = StudentTaskProcessCode.objects.create()
                process = StudentTaskProcess.objects.create(
                    process_code=process_code,
                )
                reflection = StudentTaskReflection.objects.create()
                feedback = Feedback.objects.create()

                StudentTask.objects.create(
                    student=student,
                    class_name=class_name,
                    task=task_data,
                    plan=plan,
                    process=process,
                    reflection=reflection,
                    feedback=feedback,
                )
            return Response({'status': 'Initialized'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Created'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'init student task Error: {e}')
        return Response({'init student task Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
