from rest_framework import serializers
from .models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = MediaAsset
        fields = [
            'id', 'title', 'file', 'alt_text', 'caption',
            'media_type', 'file_size', 'uploaded_by_username',
            'created_at'
        ]
        read_only_fields = ['id', 'file_size', 'created_at']