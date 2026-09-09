from rest_framework import serializers
from .models import Page, PageSection


class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = ['section_key', 'heading', 'subheading', 'content', 'display_order']


class PageDetailSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'hero_headline', 'hero_subheadline',
            'hero_cta_text', 'hero_cta_url', 'hero_image',
            'seo_title', 'seo_description', 'canonical_url', 'og_image',
            'sections'
        ]

    def get_sections(self, obj):
        active_sections = obj.sections.filter(is_active=True).order_by('display_order')
        return PageSectionSerializer(active_sections, many=True).data