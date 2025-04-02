from .base import *
import dj_database_url

# 生產環境設定
DEBUG = False
ALLOWED_HOSTS = [
    os.environ.get('RENDER_EXTERNAL_HOSTNAME', ''),
    '.onrender.com',  # 允許所有 Render 子域名
]

# 安全設定
SECRET_KEY = os.environ.get('SECRET_KEY')
X_FRAME_OPTIONS = 'DENY'
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    # 添加您的前端網址，例如：
    'https://yzuic114-webstudy.onrender.com',
]

# CSRF 設定
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [
    # 添加您的前端網址，例如：
    'https://yzuic114-webstudy.onrender.com',
]

# 數據庫設定 - 使用 Render 提供的 DATABASE_URL
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL')
    )
}

# 靜態檔案設定
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# 安全增強設定
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 年
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# 日誌設定
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
