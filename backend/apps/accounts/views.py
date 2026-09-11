from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from .models import CustomUser


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = (request.data.get('username') or request.data.get('email') or '').strip()
        password = request.data.get('password')

        if not identifier or not password:
            return Response(
                {"detail": "Both identifier and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Look up the user by email or username
        user_obj = (
            CustomUser.objects.filter(email__iexact=identifier).first()
            or CustomUser.objects.filter(username__iexact=identifier).first()
        )

        user = None
        if user_obj:
            user = authenticate(request, username=user_obj.email, password=password)
            if not user and user_obj.username:
                user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            if not user.is_active:
                return Response(
                    {"detail": "User account is disabled."},
                    status=status.HTTP_403_FORBIDDEN
                )
            login(request, user)
            return Response({
                "message": "Login successful",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "username": user.username,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                }
            }, status=status.HTTP_200_OK)

        return Response(
            {"detail": "Invalid credentials provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }, status=status.HTTP_200_OK)