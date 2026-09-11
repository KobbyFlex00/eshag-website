from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, viewsets, generics
from .models import CompanySettings, SiteStatistic, FAQ, TeamMember
from .serializers import (
    CompanySettingsSerializer,
    SiteStatisticSerializer,
    FAQSerializer,
    TeamMemberSerializer
)
from apps.projects.models import Project
from apps.leads.models import Lead, QuoteRequest, ContactMessage
from apps.careers.models import JobApplication
from apps.blog.models import BlogPost


class CompanySettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = CompanySettings.objects.first()
        if not settings:
            return Response({}, status=status.HTTP_200_OK)
        serializer = CompanySettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SiteStatisticListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = SiteStatistic.objects.filter(is_active=True).order_by('display_order')
    serializer_class = SiteStatisticSerializer


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = FAQ.objects.filter(is_active=True).order_by('display_order')
    serializer_class = FAQSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TeamMember.objects.filter(is_active=True).order_by('display_order')
    serializer_class = TeamMemberSerializer


class DashboardMetricsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "summary_cards": {
                "total_projects": Project.objects.count(),
                "active_projects": Project.objects.filter(project_status__iexact='ongoing').count(),
                "total_leads": Lead.objects.count(),
                "new_leads": Lead.objects.filter(status__iexact='new').count(),
                "quote_requests": QuoteRequest.objects.count(),
                "contact_messages": ContactMessage.objects.count(),
                "job_applications": JobApplication.objects.count(),
                "blog_posts": BlogPost.objects.count(),
            },
            "recent_activity": []
        }, status=status.HTTP_200_OK)