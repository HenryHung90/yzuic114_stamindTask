from rest_framework.response import Response
from rest_framework import status


def read_xlsx_and_xls_file(expected_headers, headers, file_extension, sheet):
    if headers != expected_headers:
        return Response({"message": f"文件格式錯誤，欄位必須依序為：{str(expected_headers)}"},
                        status=status.HTTP_400_BAD_REQUEST)
    row_data = []
    if file_extension == 'xls':
        for index in range(1, sheet.nrows):  # 跳過標題行
            filtered_values = [value for value in sheet.row_values(index) if value]  # 閱覽整個 row, if 有 value 才放 value
            row_data.append({
                'class_name': str(filtered_values[0]),
                'student_id':str(filtered_values[1]),
                'password': str(filtered_values[2]),
                'name': filtered_values[3],
                'user_type': filtered_values[4],
            })
    elif file_extension == 'xlsx':
        for index, row in enumerate(sheet.iter_rows(min_row=2), start=1):  # 跳過標題行
            filtered_values = [cell.value for cell in row if cell.value]
            row_data.append({
                'class_name': str(filtered_values[0]),
                'student_id': str(filtered_values[1]),
                'password': str(filtered_values[2]),
                'name': filtered_values[3],
                'user_type': filtered_values[4],
            })
    return row_data
