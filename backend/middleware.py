from django.http import JsonResponse
from rest_framework import status


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 排除不需要認證的路徑
        exempt_paths = ['/api/login/', '/api/register/', '/', '/files/img/logo.PNG', '/vite.svg']

        if request.path not in exempt_paths and not request.user.is_authenticated:
            return JsonResponse(
                {'message': '請先登入', 'status': 200},
                status=status.HTTP_200_OK
            )

        response = self.get_response(request)
        return response