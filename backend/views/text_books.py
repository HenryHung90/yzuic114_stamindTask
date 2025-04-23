import os
import shutil  # 用於刪除資料夾內容
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from pdf2image import convert_from_path

from backend.models import Task

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


def convert_pdf_to_images(pdf_path, output_folder):
    """
    將 PDF 檔案轉換成多個 JPG 圖片並儲存到指定資料夾
    """
    try:
        images = convert_from_path(pdf_path, dpi=300)  # 將 PDF 每頁轉成圖片，dpi 可調整解析度
        for i, image in enumerate(images):
            output_path = os.path.join(output_folder, f'page_{i + 1}.jpg')  # 儲存為 JPG
            image.save(output_path, 'JPEG')
        return len(images)
    except Exception as e:
        print(f'Error converting PDF to images: {e}')
        raise e


def sanitize_filename(filename):
    """
    清理檔案名稱，移除不合法的字元
    """
    import re
    return re.sub(r'[^\w\-.]', '_', filename)


def clear_folder(folder_path):
    """
    清空指定資料夾的所有內容
    """
    try:
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)  # 刪除檔案或符號連結
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)  # 刪除子資料夾
    except Exception as e:
        print(f'Error clearing folder {folder_path}: {e}')
        raise e


# get Text Book file
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_text_book(request):
    try:
        task_id = request.data.get('task_id')

        text_book_data = Task.objects.get(id=task_id).text_book
        file_dir = text_book_data.file_dir
        file_amount = text_book_data.file_amount

        return Response({'file_dir': file_dir, 'file_amount': file_amount}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Upload Text Book File
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_text_book_file(request):
    try:
        task_id = request.data.get('task_id')
        file = request.data.get('file')
        select_node = int(request.data.get('select_node'))

        text_book_data = Task.objects.get(id=task_id).text_book

        text_book_files_dir = text_book_data.file_dir
        text_book_files_amount = text_book_data.file_amount
        task_dir = os.path.join(str(text_book_data.name), str(select_node))

        # 確保資料夾存在
        upload_dir = os.path.join(settings.BASE_DIR,
                                  os.getenv('TEST_BOOK_FILES_DIR'),
                                  str(text_book_data.name),
                                  str(select_node))
        os.makedirs(upload_dir, exist_ok=True)

        # 清空資料夾內容
        clear_folder(upload_dir)

        # 儲存上傳的 PDF 檔案到暫存路徑
        temp_pdf_path = os.path.join(upload_dir, sanitize_filename(file.name))
        with open(temp_pdf_path, 'wb') as f:
            for chunk in file.chunks():
                f.write(chunk)

        # 將 PDF 切割成多個 JPG 圖片並存入 upload_dir
        image_amount = convert_pdf_to_images(temp_pdf_path, upload_dir)

        if len(text_book_files_dir) > select_node:
            text_book_files_dir[select_node] = task_dir
            text_book_files_amount[select_node] = image_amount

        else:
            for i in range(len(text_book_files_dir), select_node + 1):
                if i == select_node:
                    text_book_files_dir.append(task_dir)
                    text_book_files_amount.append(image_amount)
                else:
                    text_book_files_dir.append('empty')
                    text_book_files_amount.append('empty')

        text_book_data.file_dir = text_book_files_dir
        text_book_data.file_amount = text_book_files_amount
        text_book_data.save()

        return Response(
            {'message': 'success', 'file_dir': task_dir, 'file_amount': image_amount, 'file_name': file.name},
            status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload experience file Error: {e}')
        return Response({'upload experience file Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
