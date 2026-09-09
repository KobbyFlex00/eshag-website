from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service
from .serializers import ServiceListSerializer, ServiceDetailSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly accessible catalog of ESHAG construction services.
    Supports filtering by 'featured' status and search across name/description.
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['featured']
    search_fields = ['name', 'short_description', 'description']
    ordering_fields = ['display_order', 'name']
    ordering = ['display_order']

    def get_queryset(self):
        # Public gets only published services
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Service.objects.all().prefetch_related('features')
        return Service.objects.filter(status=Service.Status.PUBLISHED).prefetch_related('features')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ServiceDetailSerializer
        return ServiceListSerializer