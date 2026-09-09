from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanySettingsView, SiteStatisticListView, FAQViewSet, TeamMemberViewSet

router = DefaultRouter()
router.register('faqs', FAQViewSet, basename='faq')
router.register('team', TeamMemberViewSet, basename='team')

urlpatterns = [
    path('settings/', CompanySettingsView.as_view(), name='company_settings'),
    path('statistics/', SiteStatisticListView.as_view(), name='site_statistics'),
    path('', include(router.urls)),
]