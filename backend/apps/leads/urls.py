from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubmitContactView, SubmitQuoteView, LeadViewSet

router = DefaultRouter()
router.register('crm', LeadViewSet, basename='crm_leads')

urlpatterns = [
    path('contact/', SubmitContactView.as_view(), name='submit_contact'),
    path('quote/', SubmitQuoteView.as_view(), name='submit_quote'),
    path('', include(router.urls)),
]