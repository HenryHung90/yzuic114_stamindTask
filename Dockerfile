# 第一階段：建構前端 (frontend)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# 第二階段：建構後端 (backend)
FROM python:3.10-slim

# 安裝系統依賴（包括 poppler-utils 和其他工具）
RUN apt-get update && apt-get install -y \
    libpq-dev gcc poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 確保 pdf2image 與其他依賴正確安裝
RUN pip install pdf2image

# 複製專案檔案到容器中
COPY . .

# 設定環境變數
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=yzuic114_webstudy.settings

# 運行 Django 應用程式的指令
CMD ["sh", "-c", "gunicorn yzuic114_webstudy.wsgi:application --bind 0.0.0.0:8000"]