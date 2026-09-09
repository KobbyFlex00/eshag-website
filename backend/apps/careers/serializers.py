from rest_framework import serializers
from .models import JobPosting, JobApplication


class JobPostingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'slug', 'department', 'location',
            'employment_type', 'experience_level', 'application_deadline',
            'is_active', 'created_at'
        ]


class JobPostingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'slug', 'department', 'location',
            'employment_type', 'experience_level', 'description',
            'responsibilities', 'requirements', 'benefits',
            'application_deadline', 'is_active', 'seo_title',
            'seo_description', 'canonical_url', 'og_image',
            'created_at', 'updated_at'
        ]


class JobApplicationSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'job', 'full_name', 'email', 'phone',
            'resume', 'cover_letter', 'portfolio_url',
            'years_of_experience'
        ]


class JobApplicationDetailSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'full_name', 'email', 'phone',
            'resume', 'cover_letter', 'portfolio_url', 'years_of_experience',
            'status', 'internal_notes', 'reviewed_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'resume', 'created_at', 'updated_at']