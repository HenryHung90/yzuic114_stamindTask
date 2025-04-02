from .base import *
from dotenv import load_dotenv

# 加載環境變數
load_dotenv(dotenv_path='.env')

# 開發模式設定
DEBUG = True
ALLOWED_HOSTS = ["localhost", '127.0.0.1', '140.138.56.160']

# 安全設定
SECRET_KEY = 'django-insecure-$pao9ipcgej-wsuo4ykd*08cwe*f+q$jl=z$wv$h+h%3eweu0y'
X_FRAME_OPTIONS = 'SAMEORIGIN'
CORS_ALLOW_CREDENTIALS = True  # 允許攜帶憑證（Cookies）
CORS_ALLOW_ALL_ORIGINS = True  # 開發環境允許所有來源
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = True
SECURE_CROSS_ORIGIN_OPENER_POLICY = None  # 僅在測試 HTTP 情況下

# CSRF 設定
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]

# 數據庫設定
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# 如果需要，添加開發環境特定的應用
if DEBUG:
    INSTALLED_APPS += [
        # 'debug_toolbar',  # 如果需要使用 Django Debug Toolbar
    ]

    # MIDDLEWARE += [
    #     'debug_toolbar.middleware.DebugToolbarMiddleware',  # 如果使用 Debug Toolbar
    # ]

    # INTERNAL_IPS = ['127.0.0.1']  # Debug Toolbar 需要
