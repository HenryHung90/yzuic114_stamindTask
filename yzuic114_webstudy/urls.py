"""
URL configuration for yzuic114_webstudy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from dotenv import load_dotenv
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

# using for join static file route for media
from django.conf.urls.static import static, serve
from django.conf import settings

load_dotenv()

urlpatterns = [path("api/", include('backend.urls'))]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 從 .env 獲取 PROCESS_ON_PRODUCTION 變數
process_on_production = os.getenv('PROCESS_ON_PRODUCTION', 'False').lower() in ('true', '1', 't', 'yes')

if process_on_production:
    # 在生產環境中使用 taskmind 前綴
    urlpatterns += [re_path(r"^taskmind/.*$", TemplateView.as_view(template_name="index.html"))]
else:
    # 在非生產環境中匹配所有路徑
    urlpatterns += [re_path(r"^(?:.*)?$", TemplateView.as_view(template_name="index.html"))]