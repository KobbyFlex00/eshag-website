"""
URL configuration for ESHAG Building & Construction backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    db_status = "healthy"
    try:
        connection.ensure_connection()
        db_vendor = connection.vendor
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"
        db_vendor = "unknown"

    return JsonResponse({
        "status": "healthy" if "unhealthy" not in db_status else "degraded",
        "service": "ESHAG Building & Construction API",
        "database": {
            "status": db_status,
            "vendor": db_vendor
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)