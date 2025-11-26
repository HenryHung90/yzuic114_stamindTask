# ===============================
# 第一階段：前端
# ===============================
FROM --platform=linux/arm64 node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build

# ===============================
# 第二階段：後端
# ===============================
FROM --platform=linux/arm64 python:3.11-slim AS backend

# 安裝系統依賴（ARM64）
RUN apt-get update && apt-get install -y \
    libpq-dev gcc g++ poppler-utils build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 複製 requirements.txt
COPY requirements.txt .

# 強制抓 ARM64 wheel，避免 Illegal Instruction
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir \
    numpy \
    pyarrow \
    umap-learn \
    tiktoken \
    litellm \
    fnllm \
    --only-binary=:all:
RUN pip install --no-cache-dir -r requirements.txt

# 安裝 pdf2image（純 Python）
RUN pip install --no-cache-dir pdf2image

# 複製後端程式碼
COPY . .

# 複製前端建置結果
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 清理 node_modules
RUN rm -rf /app/frontend/node_modules

# 環境變數
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=yzuic114_webstudy.settings

# 預設啟動指令
CMD ["gunicorn", "yzuic114_webstudy.wsgi:application", "--bind", "0.0.0.0:8000"]
