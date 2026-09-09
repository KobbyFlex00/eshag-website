from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import TimeStampedModel
from apps.projects.models import Project


class Testimonial(TimeStampedModel):
    """
    Client and partner reviews. Only approved testimonials render on the public site.
    """
    client_name = models.CharField(max_length=200)
    client_title = models.CharField(max_length=150, blank=True, help_text="e.g., Property Owner, Commercial Director")
    company_name = models.CharField(max_length=150, blank=True)
    avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='testimonials'
    )
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    is_approved = models.BooleanField(default=False, db_index=True)
    featured = models.BooleanField(default=False, db_index=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        app_label = 'testimonials'
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"Review by {self.client_name} ({self.rating}/5)"