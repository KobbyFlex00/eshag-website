from rest_framework import generics, viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CompanySettings, SiteStatistic, FAQ, TeamMember
from .serializers import (
    CompanySettingsSerializer, SiteStatisticSerializer,
    FAQSerializer, TeamMemberSerializer
)


class CompanySettingsView(generics.RetrieveAPIView):
    """
    Public endpoint returning global company phone numbers, address, emails, and social links.
    """
    serializer_class = CompanySettingsSerializer

    def get_object(self):
        return CompanySettings.objects.first() or CompanySettings.objects.create()


class SiteStatisticListView(generics.ListAPIView):
    serializer_class = SiteStatisticSerializer
    queryset = SiteStatistic.objects.filter(is_active=True)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FAQSerializer
    queryset = FAQ.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.filter(is_active=True)