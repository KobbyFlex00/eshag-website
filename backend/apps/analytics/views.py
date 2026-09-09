from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.core.permissions import IsStaffOrAdminUser
from apps.core.models import SiteStatistic, AuditLog, FAQ, TeamMember
from apps.accounts.models import CustomUser
from apps.projects.models import Project
from apps.leads.models import Lead, ContactMessage, QuoteRequest
from apps.blog.models import BlogPost
from apps.testimonials.models import Testimonial
from apps.careers.models import JobApplication, JobPosting


class DashboardOverviewMetricsView(APIView):
    """
    Returns aggregated live counts for the custom administrative dashboard.
    """
    permission_classes = [IsStaffOrAdminUser]

    def get(self, request):
        total_projects = Project.objects.count()
        active_projects = Project.objects.filter(project_status=Project.ProjectStatus.ONGOING).count()
        completed_projects = Project.objects.filter(project_status=Project.ProjectStatus.COMPLETED).count()

        total_leads = Lead.objects.count()
        new_leads = Lead.objects.filter(status=Lead.Status.NEW).count()
        open_leads = Lead.objects.exclude(status__in=[Lead.Status.WON, Lead.Status.LOST, Lead.Status.ARCHIVED]).count()

        quote_requests_count = QuoteRequest.objects.count()
        contact_messages_count = ContactMessage.objects.count()
        total_users = CustomUser.objects.count()
        recent_audit_count = AuditLog.objects.count()

        blog_posts_count = BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED).count()
        pending_testimonials_count = Testimonial.objects.filter(is_approved=False).count()
        job_applications_count = JobApplication.objects.count()

        data = {
            "summary_cards": {
                "total_projects": total_projects,
                "active_projects": active_projects,
                "completed_projects": completed_projects,
                "total_leads": total_leads,
                "new_leads": new_leads,
                "open_leads": open_leads,
                "quote_requests": quote_requests_count,
                "contact_messages": contact_messages_count,
                "blog_posts": blog_posts_count,
                "pending_testimonials": pending_testimonials_count,
                "job_applications": job_applications_count,
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