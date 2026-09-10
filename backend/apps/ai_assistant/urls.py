from django.urls import path
from .views import CostEstimatorCalculateView, AIAssistantChatView

urlpatterns = [
    path('estimator/calculate/', CostEstimatorCalculateView.as_view(), name='calculate_estimate'),
    path('chat/', AIAssistantChatView.as_view(), name='assistant_chat'),
]