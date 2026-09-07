import uuid
from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model providing self-updating created_at and updated_at fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class SEOBasedModel(models.Model):
    """
    Abstract base model providing SEO and social share metadata.
    """
    seo_title = models.CharField(
        max_length=70,
        blank=True,
        help_text="Recommended limit: 60-70 characters"
    )
    seo_description = models.CharField(
        max_length=160,
        blank=True,
        help_text="Recommended limit: 150-160 characters"
    )
    canonical_url = models.URLField(blank=True, max_length=500)
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    """
    Abstract base model for content workflow management.
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True
    )
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        abstract = True


class CompanySettings(TimeStampedModel):
    """
    Global site configuration singleton. Ensures company details are never hardcoded.
    """
    company_name = models.CharField(max_length=255, default="ESHAG Building and Construction")
    brand_name = models.CharField(max_length=100, default="ESHAG")
    tagline = models.CharField(max_length=255, default="Building Dreams. Constructing Futures.")
    primary_domain = models.URLField(default="https://eshag.construction")

    # Primary Contact Info
    primary_phone = models.CharField(max_length=50, default="059 953 5884")
    secondary_phone = models.CharField(max_length=50, default="024 139 5502")
    whatsapp_number = models.CharField(max_length=50, default="059 953 5884")
    email = models.EmailField(blank=True, default="info@eshag.construction")

    # Physical / Operational Location (Strictly CMS-driven)
    address = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="Accra")
    region = models.CharField(max_length=100, blank=True, default="Greater Accra")
    country = models.CharField(max_length=100, default="Ghana")
    business_hours = models.CharField(max_length=255, blank=True, default="Mon - Fri: 8:00 AM - 5:00 PM")
    google_maps_embed_url = models.TextField(blank=True)

    # Social Channels
    instagram_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    instagram_url = models.URLField(default="https://instagram.com/eshagbuildingandconst")
    tiktok_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    tiktok_url = models.URLField(default="https://tiktok.com/@eshagbuildingandconst")
    youtube_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    youtube_url = models.URLField(default="https://www.youtube.com/@eshagbuildingandconst")
    facebook_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    # Branding Assets
    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    favicon = models.ImageField(upload_to='branding/', blank=True, null=True)
    footer_text = models.TextField(
        default="ESHAG Building and Construction is committed to delivering excellence, precision, and durability across all commercial and residential developments."
    )

    class Meta:
        verbose_name = "Company Settings"
        verbose_name_plural = "Company Settings"

    def __str__(self):
        return f"{self.company_name} - Global Settings"

    def save(self, *args, **kwargs):
        # Enforce singleton pattern (only one instance permitted)
        if not self.pk and CompanySettings.objects.exists():
            self.pk = CompanySettings.objects.first().pk
        super().save(*args, **kwargs)


class SiteStatistic(TimeStampedModel):
    """
    Configurable performance metric counters for the homepage.
    Admins enter real verified figures without code changes.
    """
    label = models.CharField(max_length=100, help_text="e.g., Projects Completed")
    value = models.PositiveIntegerField(default=0)
    suffix = models.CharField(max_length=10, blank=True, help_text="e.g., '+' or '%'")
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.label}: {self.value}{self.suffix}"