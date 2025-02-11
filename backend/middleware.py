from django.http import JsonResponse
from rest_framework import status


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 排除不需要認證的路徑
        exempt_paths = ['/api/login/', '/api/register/']

        if request.path not in exempt_paths and not request.user.is_authenticated:
            return JsonResponse(
                {'message': '請先登入', 'status': 401},
                status=status.HTTP_401_UNAUTHORIZED
            )

        response = self.get_response(request)
        return response