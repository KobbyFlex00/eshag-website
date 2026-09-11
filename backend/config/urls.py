from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.core.views import DashboardMetricsView

urlpatterns = [
    # Django Administration
    path('admin/', admin.site.urls),

    # Administrative Dashboard Metrics Endpoint
    path('api/v1/dashboard/metrics/', DashboardMetricsView.as_view(), name='dashboard_metrics'),

    # Modular Application API Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/core/', include('apps.core.urls')),
    path('api/v1/cms/', include('apps.cms.urls')),
    path('api/v1/services/', include('apps.services.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/leads/', include('apps.leads.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/v1/careers/', include('apps.careers.urls')),
    path('api/v1/testimonials/', include('apps.testimonials.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/assistant/', include('apps.ai_assistant.urls')),
]

# Serve local uploaded media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)