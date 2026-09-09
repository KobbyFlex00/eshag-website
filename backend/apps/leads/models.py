from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class Lead(TimeStampedModel):
    """
    Central CRM pipeline entity for all potential clients, inquiries, and quotation requests.
    """
    class InquiryType(models.TextChoices):
        GENERAL = 'general', 'General Inquiry'
        REQUEST_A_QUOTE = 'request_quote', 'Request a Quote'
        RESIDENTIAL = 'residential', 'Residential Construction'
        COMMERCIAL = 'commercial', 'Commercial Construction'
        RENOVATION = 'renovation', 'Renovation & Remodeling'
        PROJECT_MANAGEMENT = 'project_management', 'Project Management'
        CONSULTATION = 'consultation', 'Consultation'
        PARTNERSHIP = 'partnership', 'Partnership'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        NEW = 'new', 'New'
        CONTACTED = 'contacted', 'Contacted'
        QUALIFIED = 'qualified', 'Qualified'
        PROPOSAL_SENT = 'proposal_sent', 'Proposal Sent'
        NEGOTIATION = 'negotiation', 'Negotiation'
        WON = 'won', 'Won'
        LOST = 'lost', 'Lost'
        ARCHIVED = 'archived', 'Archived'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    class Source(models.TextChoices):
        WEBSITE = 'website', 'Website'
        INSTAGRAM = 'instagram', 'Instagram'
        TIKTOK = 'tiktok', 'TikTok'
        YOUTUBE = 'youtube', 'YouTube'
        REFERRAL = 'referral', 'Referral'
        GOOGLE = 'google', 'Google'
        DIRECT = 'direct', 'Direct'
        OTHER = 'other', 'Other'

    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    company = models.CharField(max_length=255, blank=True)
    
    inquiry_type = models.CharField(
        max_length=50,
        choices=InquiryType.choices,
        default=InquiryType.GENERAL,
        db_index=True
    )
    project_type = models.CharField(max_length=100, blank=True)
    project_location = models.CharField(max_length=255, blank=True)
    estimated_budget = models.CharField(max_length=100, blank=True)
    preferred_start_date = models.DateField(null=True, blank=True)
    message = models.TextField()

    source = models.CharField(
        max_length=50,
        choices=Source.choices,
        default=Source.WEBSITE,
        db_index=True
    )
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True
    )
    priority = models.CharField(
        max_length=50,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        db_index=True
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads'
    )
    notes = models.TextField(blank=True, help_text="Internal notes summary")

    class Meta:
        app_label = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.get_inquiry_type_display()} - {self.get_status_display()})"


class LeadNote(TimeStampedModel):
    """
    Chronological communication log on client developments.
    """
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='lead_notes')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    note = models.TextField()

    class Meta:
        app_label = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"Note on {self.lead.full_name} at {self.created_at}"


class LeadActivity(TimeStampedModel):
    """
    Automated trail of state transitions (status change, assignment change).
    """
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)

    class Meta:
        app_label = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} on {self.lead.full_name}"


class ContactMessage(TimeStampedModel):
    """
    Stores raw messages submitted via the public contact form (/contact).
    """
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_processed = models.BooleanField(default=False)
    lead = models.OneToOneField(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='contact_source')

    class Meta:
        app_label = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name}: {self.subject}"


class QuoteRequest(TimeStampedModel):
    """
    Detailed quote estimation submission with architectural drawings or PDF plans.
    """
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    project_type = models.CharField(max_length=100)
    project_location = models.CharField(max_length=255)
    project_description = models.TextField()
    estimated_budget = models.CharField(max_length=100, blank=True)
    desired_start_date = models.DateField(null=True, blank=True)
    attachment = models.FileField(upload_to='quote_attachments/%Y/%m/', blank=True, null=True)
    additional_message = models.TextField(blank=True)
    is_processed = models.BooleanField(default=False)
    lead = models.OneToOneField(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='quote_source')

    class Meta:
        app_label = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"Quote Request from {self.full_name} ({self.project_type})"