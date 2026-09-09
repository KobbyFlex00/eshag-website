from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register('posts', BlogPostViewSet, basename='blog_post')
router.register('categories', BlogCategoryViewSet, basename='blog_category')

urlpatterns = router.urls