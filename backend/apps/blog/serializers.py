from rest_framework import serializers
from .models import BlogCategory, BlogTag, BlogPost


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description']


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']


class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category', 'tags',
            'author_name', 'excerpt', 'featured_image',
            'featured', 'read_time_minutes', 'published_at'
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category', 'tags',
            'author_name', 'excerpt', 'content', 'featured_image',
            'featured', 'read_time_minutes', 'seo_title',
            'seo_description', 'canonical_url', 'og_image',
            'published_at', 'created_at', 'updated_at'
        ]