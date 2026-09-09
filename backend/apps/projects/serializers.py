from rest_framework import serializers
from .models import Project, ProjectImage, ProjectUpdate


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'alt_text', 'display_order']


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = ['id', 'title', 'description', 'percentage_complete', 'update_date', 'published']


class ProjectListSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'project_code', 'short_description',
            'project_type', 'project_status', 'location', 'client_name',
            'start_date', 'completion_date', 'featured_image', 'featured',
            'display_order', 'images'
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'project_code', 'short_description', 'description',
            'project_type', 'project_status', 'location', 'client_name',
            'start_date', 'expected_completion_date', 'completion_date',
            'featured_image', 'featured', 'display_order',
            'seo_title', 'seo_description', 'canonical_url', 'og_image',
            'images', 'updates', 'created_at', 'updated_at'
        ]