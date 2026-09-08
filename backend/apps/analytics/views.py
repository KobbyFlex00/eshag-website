from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.core.permissions import IsStaffOrAdminUser
from apps.core.models import SiteStatistic, AuditLog
from accounts.models import CustomUser


class DashboardOverviewMetricsView(APIView):
    """
    Returns high-level business intelligence metrics for the custom admin dashboard.
    Strictly restricted to authorized administrative and management roles.
    """
    permission_classes = [IsStaffOrAdminUser]

    def get(self, request):
        # Dynamically query active counts, with safe fallbacks if models are populated in upcoming phases
        total_users = CustomUser.objects.count()
        recent_audit_count = AuditLog.objects.count()

        # Placeholders wired for upcoming phase models (CMS, Projects, Leads, Careers, Testimonials)
        # These reflect real database statistics as each module is built
        data = {
            "summary_cards": {
                "total_projects": 0,
                "active_projects": 0,
                "completed_projects": 0,
                "new_leads": 0,
                "open_leads": 0,
                "quote_requests": 0,
                "blog_posts": 0,
                "pending_testimonials": 0,
                "job_applications": 0,
                "contact_messages": 0,
                "system_users": total_users,
                "audit_logs_recorded": recent_audit_count,
            },
            "system_health": {
                "database": "postgresql",
                "backend_status": "operational",
            },
            "recent_activity": [
                {
                    "id": str(log.id),
                    "action": log.action,
                    "description": log.description,
                    "created_at": log.created_at.isoformat(),
                    "user": log.user.username if log.user else "System",
                }
                for log in AuditLog.objects.select_related('user')[:5]
            ]
        }

        return Response(data, status=status.HTTP_200_OK)