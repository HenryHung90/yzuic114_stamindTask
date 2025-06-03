from django.http import JsonResponse
from rest_framework import status
from django.conf import settings


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
