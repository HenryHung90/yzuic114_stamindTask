import os

from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime

from backend.models import StudentTask

client = OpenAI(api_key=os.getenv('OPENAI_KEY'))

SYSTEM_PROMPT = """
#zh-tw
The user may provide you with past messages in the following format: 過去的訊息內容：時間:{time}訊息:{message}*end*\n
You should only use these past messages as a reference to better understand the context of the user's question. Do not directly include or repeat the past messages in your response unless explicitly requested by the user.
You are an intelligent and helpful assistant dedicated to answering only questions related to the course content. 
You must not answer any question or provide information that is unrelated to the course.
When responding to the following prompt, 
please make sure to properly style your response using Github Flavored Markdown. 
Use markdown syntax for things like headings, lists, colored text, code blocks, highlights etc.
"""


# OpenAI integrate
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def chat_with_amumamum(request):
    try:
        user_question = request.data.get('message')
        task_id = request.data.get('task_id')
        user_history_data = StudentTask.objects.get(student_id=request.user.student_id, task_id=task_id).chat_history

        if user_history_data.chat_history is None:
            user_history_data.chat_history = []

        # 取前 10 則訊息當作回顧輸入
        user_history_stringify = ""
        for history in user_history_data.chat_history[-10:]:
            if history['student_id'] != '':
                user_history_stringify += '過去的訊息內容：時間:{time}訊息:{message}*end*\n'.format(time=history['time'],
                                                                                                   message=history[
                                                                                                       'message']
                                                                                                   )
        user_content = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "name": request.user.name,
            "student_id": request.user.student_id,
            "message": user_question,
        }

        sending_data = client.chat.completions.create(model="gpt-3.5-turbo",
                                                      temperature=0.5,
                                                      max_tokens=2048,
                                                      messages=[
                                                          {"role": "system",
                                                           "content": SYSTEM_PROMPT + user_history_stringify},
                                                          {"role": "user",
                                                           "content": user_question}]
                                                      )

        gpt_response = sending_data.choices[0].message.content
        gpt_content = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "name": "Amum Amum",
            "student_id": "",
            "message": gpt_response,
        }
        user_history_data.chat_history.append(user_content)
        user_history_data.chat_history.append(gpt_content)
        user_history_data.save()

        return Response({'assistant': gpt_content}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'chat with amumamum Error: {e}')
        return Response({'chat with amumamum Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
