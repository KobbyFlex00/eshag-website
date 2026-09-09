from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, BlogCategory
from .serializers import (
    BlogPostListSerializer, BlogPostDetailSerializer,
    BlogCategorySerializer
)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public article catalog for insights, guides, and engineering updates.
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'read_time_minutes']
    ordering = ['-published_at']

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return BlogPost.objects.all().select_related('category', 'author').prefetch_related('tags')
        return BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED).select_related('category', 'author').prefetch_related('tags')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'