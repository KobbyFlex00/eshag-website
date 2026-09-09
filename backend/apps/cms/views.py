from rest_framework import generics, permissions
from .models import Page
from .serializers import PageDetailSerializer


class PageDetailView(generics.RetrieveAPIView):
    """
    Public endpoint to fetch structured page data (including hero and sections) by slug.
    """
    lookup_field = 'slug'
    serializer_class = PageDetailSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Page.objects.all().prefetch_related('sections')
        return Page.objects.filter(status=Page.Status.PUBLISHED).prefetch_related('sections')