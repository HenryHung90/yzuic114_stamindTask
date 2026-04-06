# 前端 (frontend)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build

# 後端 (backend)
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libpq-dev gcc poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install pdf2image

COPY . .

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 設定環境變數
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=yzuic114_webstudy.settings

RUN rm -rf /app/frontend/node_modules
