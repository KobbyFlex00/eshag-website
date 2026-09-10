from rest_framework import serializers
from .models import EstimatorSubmission, ChatMessage


class CalculateEstimateInputSerializer(serializers.Serializer):
    project_category = serializers.ChoiceField(choices=EstimatorSubmission.ProjectCategory.choices)
    floor_area_sqm = serializers.FloatField(min_value=10.0, max_value=20000.0)
    floors = serializers.IntegerField(min_value=1, max_value=40, default=1)
    finish_quality = serializers.ChoiceField(
        choices=EstimatorSubmission.FinishQuality.choices,
        default=EstimatorSubmission.FinishQuality.STANDARD
    )
    # Optional contact info to capture lead
    contact_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    contact_email = serializers.EmailField(required=False, allow_blank=True)
    contact_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)


class EstimatorSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstimatorSubmission
        fields = '__all__'


class ChatQuerySerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=100)
    message = serializers.CharField(max_length=2000)