# YZU IC114 StaMind Task

**YZU IC114 StaMind Task** 
是一個基於 Django 和 React TypeScript 的全端專案，旨在為學生提供一個反思任務的平臺，幫助學生記錄和回顧學習過程中的任務執行情況。
並且用於碩士研究：基於 RAG 與 graphRAG 技術對學習成效的影響評估，收集學生學習數據與學習效能分析
。

## 專案簡介

這個專案的目的是建立一個任務反思系統，學生透過前端介面理解、規劃並最後完成教學指定專案，並由後端進行處理和存儲。系統同具有認證與權限管理，確保數據安全。

## 功能特性

- **任務反思提交**：學生可以提交任務反思內容。
- **用戶認證**：支持註冊、登入和權限管理。
- **後端 API**：提供 RESTful API 供前端使用。
- **前端互動介面**：基於 React，提供直觀的用戶體驗。
- **數據管理**：後端使用資料庫進行數據存儲和檢索。

## 技術棧

### 後端
- **框架**：Django
- **語言**：Python
- **資料庫**：PostgreSQL
- **API**：Django REST Framework (DRF)

### 前端
- **框架**：React
- **語言**：TypeScript
- **樣式**：TailwindCSS / Material-Tailwind

### 其他工具
- **版本控制**：Git
- **持續整合**：GitHub Actions

## 系統架構

該專案採用了前後端分離的架構：
- **後端**：Django 提供 API，負責數據處理、業務邏輯和資料庫交互。
- **前端**：React 負責用戶界面，通過 API 與後端通信。

## 安裝與使用

### 環境需求
- Python 3.8 或以上
- Node.js 14 或以上
- npm 或 yarn
- Git

### 後端安裝

1. 克隆專案：
   ```bash
   git clone https://github.com/HenryHung90/yzuic114_stamindTask.git
   cd yzuic114_stamindTask
   ```

2. 安裝 Python 依賴：
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. 遷移資料庫：
   ```bash
   python manage.py migrate
   ```

4. 啟動後端伺服器：
   ```bash
   python manage.py runserver
   ```

### 前端安裝

1. 進入前端目錄：
   ```bash
   cd frontend
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

### 訪問應用
- 前端：`http://localhost:5713`
- 前後端整合: `http://localhost:8000`

## 專案結構

```plaintext
yzuic114_webstudy/
├── .github/                 # GitHub 工作流相關設定（如 CI/CD）
├── .venv/                   # 虛擬環境目錄（Python 虛擬環境）
├── backend/                 # 後端程式碼目錄
│   ├── migrations/          # Django 資料庫遷移檔案
│   ├── models/              # 資料庫模型
│   ├── views/               # 處理邏輯與 API 規則
│   │   ├── __init__.py      # 初始化檔案
│   │   ├── admin.py         # Django 管理介面相關設定
│   │   ├── apps.py          # 應用程式設定檔
│   │   ├── middleware.py    # 中介軟體設定
│   │   ├── permission.py    # 權限控制邏輯
│   │   ├── tests.py         # 單元測試檔案
│   │   └── urls.py          # 路由設定
│
├── frontend/                # 前端程式碼目錄
│   ├── dist/                # 前端建置後的輸出檔案
│   ├── node_modules/        # Node.js 相依套件目錄
│   ├── public/              # 靜態資源（如 HTML、圖片等）
│   ├── src/                 # 前端源碼目錄
│   │   ├── .env             # 環境變數設定檔
│   ├── .gitignore           # Git 忽略規則
│   ├── index.html           # 前端主入口 HTML
│   ├── package.json         # Node.js 套件設定檔
│   ├── package-lock.json    # Node.js 套件鎖定檔案
│   ├── postcss.config.js    # PostCSS 設定檔
│   ├── tailwind.config.js   # Tailwind CSS 設定檔
│   ├── tsconfig.json        # TypeScript 設定檔
│   ├── tsconfig.node.json   # Node.js 的 TypeScript 設定檔
│   ├── vite.config.ts       # Vite 開發工具設定檔
│   ├── vite.config.ts.timestamp-* # Vite 設定檔的時間戳備份
│
├── yzuic114_webstudy/
│   ├── __init__.py            # 後端應用初始化檔案
│   ├── asgi.py                # ASGI 應用入口，用於非同步服務（如 WebSocket）
│   ├── settings.py            # Django 設定檔案
│   ├── urls.py                # 全域路由設定
│   ├── wsgi.py                # WSGI 應用入口，用於部署（如 Gunicorn）
├─ .env                   # 環境變數設定檔
├─ .gitignore             # Git 忽略規則
├─ manage.py              # Django 管理工具入口
├─ README.md              # 專案說明文件
└─ requirements.txt       # Python 套件需求檔案
```

## 貢獻指南

歡迎對本專案進行貢獻！請遵循以下步驟：
1. Fork 此專案。
2. 創建分支：`git checkout -b feature/你的功能名稱`
3. 提交更改：`git commit -m '新增功能描述'`
4. 推送分支：`git push origin feature/你的功能名稱`
5. 發起 Pull Request。

## 授權

本專案採用 MIT 授權。詳細資訊請參考 [LICENSE](LICENSE) 文件。

## 聯繫方式

如果有任何問題或建議，請聯繫專案作者：
- **GitHub**: [HenryHung90](https://github.com/HenryHung90)