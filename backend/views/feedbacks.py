import os

from django.db import transaction
from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from backend.models import User, Task, StudentTask
from yzuic114_webstudy.settings import BASE_DIR

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""

client = OpenAI(api_key=os.getenv('OPENAI_KEY'))

SYSTEM_PROMPT = """
#zh-tw
你是一位善良且幽默的評量老師，專注於幫助學生成長。
請根據以下四個方面，一步一步分析學生的學習內容，提供建設性且幽默的回饋，並可以以條列式進行分析：

#方向
- 程式內容：評估學生程式碼的邏輯性、創意性和可讀性，指出亮點與改進建議。
- 計畫設定：分析學生的目標與計畫是否合理，給予正面回饋和實際建議。
- 輔助機器人的問答：評估學生的提問清晰度，提供更好利用輔助工具的建議。
- 最後的反思：評估學生對學習過程的理解與自我檢討能力，給予鼓勵。
- 總評：給予整體的評估，並從 0 ~ 100 分給予學生分數。

請保持輕鬆幽默的語氣，讓學生感到被尊重與激勵，同時指出不足之處。
"""


def serialize_reflections(task_reflections, student_reflections, select_node):
    # 初始化結果的文字串
    result = []
    for question_index, question in enumerate(task_reflections[select_node]):
        # 獲取學生的回答，根據階段和問題索引
        question_title = question.get('title')
        try:
            answer = student_reflections[select_node][question_index].get('reflect')
        except IndexError:
            answer = "尚未回答"
        # 合併問題與回答成文字
        result.append(f"老師問的問題：{question_title}, 學生的回答：{answer}")
    # 將所有文字合併成一個完整的字串，並用換行符分隔
    return "\n".join(result)


def serialize_chat_history(student_chat_history):
    result = []
    for history in student_chat_history:
        if history.get('name') != 'Amum Amum':
            result.append(history.get('message'))
    # 將所有文字合併成一個完整的字串，並用換行符分隔
    return "\n".join(result)


def serialize_description_of_student(target, student_plan, student_code, task_reflections, student_reflections,
                                     student_chat_history, select_node):
    description_of_student = "本次學習目標:\n" + target.targets[select_node] + target.descriptions[select_node] + '\n'
    description_of_student += "學生的學習計劃:\n" + str(student_plan.plan_list) + '\n'
    description_of_student += "學生的程式碼:\n" + 'HTML程式:' + student_code.html_code + '\nCSS程式:\n' + student_code.css_code + '\nJS程式:\n' + student_code.js_code + '\n'
    description_of_student += "本次的所有反思問題以及回答如下：\n" + serialize_reflections(task_reflections,
                                                                                          student_reflections,
                                                                                          select_node) + '\n'
    description_of_student += "本次學生問過的問題如下：\n" + serialize_chat_history(student_chat_history)
    return description_of_student


# get Teacher feedback
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_teacher_feedback(request):
    try:
        task_id = request.data.get('task_id')
        select_node = request.data.get('select_node')

        feedback_data = StudentTask.objects.get(id=task_id).feedback.teacher_feedback

        if not feedback_data:
            return Response({
                'feedback': 'empty'
            }, status=status.HTTP_200_OK)

        if select_node < len(feedback_data):
            feedback_data = feedback_data[select_node]
        else:
            feedback_data = ''

        return Response({
            'feedback': 'empty' if feedback_data == '' else feedback_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'get teacher feedback Error: {e}')
        return Response({'get teacher feedback Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# generate teacher feedback
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def generate_teacher_feedback(request):
    try:
        task_id = request.data.get('task_id')
        select_node = request.data.get('select_node')

        with transaction.atomic():
            task_data = Task.objects.get(id=task_id)
            student_task_data = StudentTask.objects.get(id=task_id, student_id=request.user.student_id)
            feedback_data = StudentTask.objects.get(id=task_id).feedback

            # get task target
            task_target = task_data.target
            # get student plan
            student_plan = student_task_data.plan
            # get student code
            student_code = student_task_data.process.process_code
            # get reflection questions of task & student response
            task_reflection_questions = task_data.reflection_question.questions
            student_reflections = student_task_data.reflection.reflects
            # get student chat history
            student_chat_history = User.objects.get(student_id=request.user.student_id).chat_history

            student_chat_history = [] if student_chat_history is None else student_chat_history.chat_history

            student_summarize = serialize_description_of_student(task_target, student_plan, student_code,
                                                                 task_reflection_questions,
                                                                 student_reflections, student_chat_history, select_node)

            file_path = os.path.join(BASE_DIR, 'exports',
                                     f"任務_{task_data.name}_{request.user.student_id}學生總結.txt")

            sending_data = client.chat.completions.create(model="gpt-3.5-turbo",
                                                          temperature=0.3,
                                                          max_tokens=3000,
                                                          messages=[
                                                              {"role": "system",
                                                               "content": SYSTEM_PROMPT},
                                                              {"role": "user",
                                                               "content": student_summarize}]
                                                          )
            gpt_response = sending_data.choices[0].message.content

            with open(file_path, "w", encoding="utf-8") as file:
                file.write(student_summarize + '\n\n\n智能回饋' + gpt_response)

            if len(feedback_data.teacher_feedback) > select_node:
                feedback_data.teacher_feedback[select_node] = gpt_response
            else:
                for i in range(len(feedback_data.teacher_feedback), select_node + 1):
                    if i == select_node:
                        feedback_data.teacher_feedback.append(gpt_response)
                    else:
                        feedback_data.teacher_feedback.append('empty')

        feedback_data.save()

        return Response({
            'feedback': gpt_response
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f'generate teacher feedback Error: {e}')
        return Response({'generate teacher feedback Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
