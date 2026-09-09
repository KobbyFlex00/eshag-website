from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicJobPostingViewSet, SubmitJobApplicationView,
    HRJobApplicationViewSet
)

router = DefaultRouter()
router.register('jobs', PublicJobPostingViewSet, basename='public_jobs')
router.register('applications', HRJobApplicationViewSet, basename='hr_applications')

urlpatterns = [
    path('apply/', SubmitJobApplicationView.as_view(), name='submit_application'),
    path('', include(router.urls)),
]