from django.urls import path
from .views import LoginView, LogoutView, CurrentUserView

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('profile/', CurrentUserView.as_view(), name='auth_profile'),
    path('me/', CurrentUserView.as_view(), name='auth_me'),
]