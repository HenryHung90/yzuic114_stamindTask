# 使用多階段建構

# 第一階段：建構前端 (frontend)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# 第二階段：建構後端 (backend)
FROM python:3.10-slim

# 安裝系統依賴（包括 pg_config）
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# 複製專案檔案到容器中
COPY . .

# 設定環境變數（可選，這裡只是作為範例）
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=yzuic114_webstudy.settings

# 如果需要使用 .env 檔案中的變數，將其加載
# 這裡假設你會在 docker-compose.yml 中處理 .env 的加載

# 運行 Django 應用程式的指令
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]