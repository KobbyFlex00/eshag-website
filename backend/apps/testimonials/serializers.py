from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_title', 'company_name',
            'avatar', 'quote', 'rating', 'featured',
            'display_order', 'project_title'
        ]