from rest_framework.response import Response
from rest_framework import status

import numpy as np


def read_xlsx_and_xls_file(expected_headers, headers, file_extension, sheet):
    if headers != expected_headers:
        return Response({"message": f"文件格式錯誤，欄位必須依序為：{str(expected_headers)}"},
                        status=status.HTTP_400_BAD_REQUEST)
    row_data = []
    if file_extension == 'xls':
        for index in range(1, sheet.nrows):  # 跳過標題行
            filtered_values = [value for value in sheet.row_values(index) if value]  # 閱覽整個 row, if 有 value 才放 value
            if not filtered_values: continue
            row_data.append({
                'class_name': str(filtered_values[0]),
                'student_id': str(filtered_values[1]),
                'password': str(filtered_values[2]),
                'name': filtered_values[3],
                'user_type': filtered_values[4],
            })
    elif file_extension == 'xlsx':
        for index, row in enumerate(sheet.iter_rows(min_row=2), start=1):  # 跳過標題行
            filtered_values = [cell.value for cell in row if cell.value]
            if not filtered_values: continue
            row_data.append({
                'class_name': str(filtered_values[0]),
                'student_id': str(filtered_values[1]),
                'password': str(filtered_values[2]),
                'name': filtered_values[3],
                'user_type': filtered_values[4],
            })
    return row_data


def transfer_key_to_values(value):
    words = {
        # for plan
        'strategy': '策略',
        'time': '時間',
        'description': '描述',
        'environment': '環境制定',
        'learning_strategy': '學習策略',
        'time_management': '時間管理',
        'finding_help': '尋求協助',
        'self_assessment': '自我評估'
    }

    return words[value] if words.get(value) else value


def calculate_box_plot_data(data_list):
    if not data_list:
        return {"min": 0, "q1": 0, "median": 0, "means": 0, "q3": 0, "max": 0}

        # 排序數據
    sorted_data = sorted(data_list)
    n = len(sorted_data)

    # 計算最小值和最大值
    min_data = sorted_data[0]
    max_data = sorted_data[-1]

    # 計算中位數
    if n % 2 == 0:
        median = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
    else:
        median = sorted_data[n // 2]

    # 計算平均數
    np_array = np.array(sorted_data)
    means = np.mean(np_array)

    # 計算第一四分位數 (Q1)
    q1_pos = n // 4
    if n % 4 == 0:
        q1 = (sorted_data[q1_pos - 1] + sorted_data[q1_pos]) / 2
    else:
        q1 = sorted_data[q1_pos]

    # 計算第三四分位數 (Q3)
    q3_pos = 3 * n // 4
    if n % 4 == 0:
        q3 = (sorted_data[q3_pos - 1] + sorted_data[q3_pos]) / 2
    else:
        q3 = sorted_data[q3_pos]

    # 返回字典，包含所有計算結果
    return {
        "min": min_data,
        "q1": q1,
        "median": median,
        "means": means,
        "q3": q3,
        "max": max_data
    }
