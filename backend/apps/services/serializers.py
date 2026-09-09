from rest_framework import serializers
from .models import Service, ServiceFeature


class ServiceFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = ['id', 'title', 'description', 'display_order']


class ServiceListSerializer(serializers.ModelSerializer):
    features = ServiceFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'short_description', 'icon',
            'featured_image', 'featured', 'display_order', 'features'
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    features = ServiceFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'short_description', 'description',
            'icon', 'featured_image', 'featured', 'display_order',
            'seo_title', 'seo_description', 'canonical_url', 'og_image',
            'features', 'created_at', 'updated_at'
        ]