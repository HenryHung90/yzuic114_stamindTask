from django.http import JsonResponse
from rest_framework import status
from django.conf import settings
from django.utils import timezone
from backend.models import LoginAttempt


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class IPBlockerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 只檢查登入路徑的請求
        if request.path == '/api/login/' and request.method == 'POST':
            ip_address = get_client_ip(request)

            # 檢查 IP 是否被封鎖
            block_record = LoginAttempt.objects.filter(
                ip_address=ip_address,
                blocked_until__gt=timezone.now()
            ).first()

            if block_record:
                remaining_time = block_record.blocked_until - timezone.now()
                minutes = int(remaining_time.total_seconds() // 60)
                return JsonResponse({
                    'message': f'由於多次登入失敗，您的 IP 已被暫時封鎖。請在 {minutes} 分鐘後再試。',
                    'status': 403
                }, status=403)

        response = self.get_response(request)
        return response


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_path = getattr(settings, 'MIDDLEWARE_EXEMPT_PATHS', [])
        self.admin_prefix = getattr(settings, 'MIDDLEWARE_ADMIN_PREFIX', '')

    def __call__(self, request):
        # 如果是靜態文件請求，直接放行
        if request.path.startswith(settings.STATIC_URL):
            return self.get_response(request)

        if request.path not in self.exempt_path and not request.user.is_authenticated:
            return JsonResponse(
                {'message': '請先登入', 'status': 200},
                status=status.HTTP_200_OK
            )

        if request.path.startswith(self.admin_prefix) and request.user.user_type != 'TEACHER':
            return JsonResponse(
                {'message': 'permission denied', 'status': 400},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = self.get_response(request)
        return response
