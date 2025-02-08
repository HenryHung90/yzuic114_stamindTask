from django.urls import path
from . import views

urlpatterns = []

API_POST = [
    # User 常規操作
    path('register/', views.register, name='register'),
    path('login/', views.login_system, name='login'),
]

API_GET = [
    # User Session 相關
    path('logout/', views.logout_system, name='logout'),
    path('get_userinfo/', views.userinfo_view, name='userinfo_view'),

    #User tasksinfo 相關
    path('get_tasks_info/', views.get_tasks_info, name='taskinfo_view'),
]

urlpatterns += API_POST + API_GET
