from rest_framework import serializers
from .models import FAQ, TeamMember, CompanySettings, SiteStatistic


class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = '__all__'


class SiteStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStatistic
        fields = ['id', 'label', 'value', 'suffix', 'display_order']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'display_order']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'photo', 'linkedin_url', 'display_order']