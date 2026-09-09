from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public catalog of approved client reviews.
    """
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['featured', 'rating']
    ordering_fields = ['display_order', 'created_at']
    ordering = ['display_order', '-created_at']

    def get_queryset(self):
        return Testimonial.objects.filter(is_approved=True).select_related('project')