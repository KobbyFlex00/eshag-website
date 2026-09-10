from django.db import models
from apps.core.models import TimeStampedModel
from apps.leads.models import Lead


class EstimatorSubmission(TimeStampedModel):
    """
    Records calculations run through the interactive construction cost calculator.
    """
    class ProjectCategory(models.TextChoices):
        RESIDENTIAL = 'residential', 'Residential Construction'
        COMMERCIAL = 'commercial', 'Commercial Construction'
        RENOVATION = 'renovation', 'Renovation & Remodeling'
        PROJECT_MANAGEMENT = 'project_management', 'Project Management'

    class FinishQuality(models.TextChoices):
        STANDARD = 'standard', 'Standard Quality'
        PREMIUM = 'premium', 'Premium / Contemporary'
        LUXURY = 'luxury', 'High-End Luxury'

    project_category = models.CharField(max_length=50, choices=ProjectCategory.choices, db_index=True)
    floor_area_sqm = models.FloatField(help_text="Estimated total area in square meters")
    floors = models.PositiveSmallIntegerField(default=1)
    finish_quality = models.CharField(max_length=30, choices=FinishQuality.choices, default=FinishQuality.STANDARD)
    
    # Calculated estimates (GHS)
    estimated_materials_cost = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_labor_cost = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_management_cost = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_total_low = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_total_high = models.DecimalField(max_digits=12, decimal_places=2)

    # Optional lead capture
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='estimates')
    contact_name = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)

    class Meta:
        app_label = 'ai_assistant'
        ordering = ['-created_at']

    def __str__(self):
        return f"Estimate #{str(self.id)[:8]} ({self.get_project_category_display()} - {self.floor_area_sqm} sqm)"


class ChatMessage(TimeStampedModel):
    """
    Logs user inquiries and AI Assistant responses for service quality assurance.
    """
    class Sender(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'AI Assistant'

    session_id = models.CharField(max_length=100, db_index=True)
    sender = models.CharField(max_length=20, choices=Sender.choices)
    content = models.TextField()

    class Meta:
        app_label = 'ai_assistant'
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.session_id[:8]}] {self.sender}: {self.content[:40]}"