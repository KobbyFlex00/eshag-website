from rest_framework import serializers
from .models import Project, ProjectImage, ProjectUpdate


class ProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'image_url', 'caption', 'display_order']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = ['id', 'title', 'description', 'percentage_complete', 'update_date']


class ProjectListSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'project_code', 'project_type', 'project_status',
            'location', 'client_name', 'short_description', 'featured_image',
            'featured_image_url', 'start_date', 'completion_date', 'featured',
            'display_order', 'status', 'published_at', 'images'
        ]

    def get_featured_image_url(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'project_code', 'project_type', 'project_status',
            'location', 'client_name', 'short_description', 'description',
            'featured_image', 'featured_image_url', 'start_date', 'completion_date',
            'featured', 'display_order', 'status', 'published_at', 'images', 'updates'
        ]

    def get_featured_image_url(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None


ProjectSerializer = ProjectDetailSerializer