from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public portfolio API for ESHAG construction projects.
    Supports filtering by project_type, project_status, and featured flag.
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project_type', 'project_status', 'featured']
    search_fields = ['title', 'project_code', 'location', 'client_name', 'description']
    ordering_fields = ['display_order', 'start_date', 'created_at']
    ordering = ['display_order', '-created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Project.objects.all().prefetch_related('images', 'updates')
        return Project.objects.filter(status=Project.Status.PUBLISHED).prefetch_related('images', 'updates')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer