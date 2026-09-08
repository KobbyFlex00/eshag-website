from django.urls import path
from .views import DashboardOverviewMetricsView

urlpatterns = [
    path('metrics/', DashboardOverviewMetricsView.as_view(), name='dashboard_metrics'),
]