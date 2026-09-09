from rest_framework import serializers
from .models import Lead, LeadNote, LeadActivity, ContactMessage, QuoteRequest


class LeadNoteSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = LeadNote
        fields = ['id', 'author', 'author_username', 'note', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class LeadActivitySerializer(serializers.ModelSerializer):
    performer_name = serializers.CharField(source='performed_by.username', read_only=True)

    class Meta:
        model = LeadActivity
        fields = ['id', 'performer_name', 'action', 'details', 'created_at']


class LeadSerializer(serializers.ModelSerializer):
    lead_notes = LeadNoteSerializer(many=True, read_only=True)
    activities = LeadActivitySerializer(many=True, read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'full_name', 'email', 'phone', 'company',
            'inquiry_type', 'project_type', 'project_location',
            'estimated_budget', 'preferred_start_date', 'message',
            'source', 'status', 'priority', 'assigned_to',
            'assigned_to_username', 'notes', 'lead_notes',
            'activities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """
    Validates public /contact submission and connects a CRM lead.
    """
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']

    def create(self, validated_data):
        # Automatically create connected CRM Lead
        lead = Lead.objects.create(
            full_name=validated_data['name'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            inquiry_type=Lead.InquiryType.GENERAL,
            message=f"Subject: {validated_data['subject']}\n\n{validated_data['message']}",
            source=Lead.Source.WEBSITE,
            status=Lead.Status.NEW,
            priority=Lead.Priority.MEDIUM
        )
        return ContactMessage.objects.create(lead=lead, **validated_data)


class QuoteSubmissionSerializer(serializers.ModelSerializer):
    """
    Validates public /request-quote submission and connects a CRM lead.
    """
    class Meta:
        model = QuoteRequest
        fields = [
            'full_name', 'email', 'phone', 'project_type',
            'project_location', 'project_description',
            'estimated_budget', 'desired_start_date',
            'attachment', 'additional_message'
        ]

    def create(self, validated_data):
        lead = Lead.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            inquiry_type=Lead.InquiryType.REQUEST_A_QUOTE,
            project_type=validated_data['project_type'],
            project_location=validated_data['project_location'],
            estimated_budget=validated_data.get('estimated_budget', ''),
            preferred_start_date=validated_data.get('desired_start_date', None),
            message=f"{validated_data['project_description']}\n\nAdditional notes: {validated_data.get('additional_message', '')}",
            source=Lead.Source.WEBSITE,
            status=Lead.Status.NEW,
            priority=Lead.Priority.HIGH
        )
        return QuoteRequest.objects.create(lead=lead, **validated_data)