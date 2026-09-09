import uuid
from django.db import models
from django.conf import settings


class TimeStampedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class SEOBasedModel(models.Model):
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)
    canonical_url = models.URLField(blank=True, max_length=500)
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        abstract = True


class CompanySettings(TimeStampedModel):
    company_name = models.CharField(max_length=255, default="ESHAG Building and Construction")
    brand_name = models.CharField(max_length=100, default="ESHAG")
    tagline = models.CharField(max_length=255, default="Building Dreams. Constructing Futures.")
    primary_domain = models.URLField(default="https://eshag.construction")

    primary_phone = models.CharField(max_length=50, default="059 953 5884")
    secondary_phone = models.CharField(max_length=50, default="024 139 5502")
    whatsapp_number = models.CharField(max_length=50, default="059 953 5884")
    email = models.EmailField(blank=True, default="info@eshag.construction")

    address = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="Accra")
    region = models.CharField(max_length=100, blank=True, default="Greater Accra")
    country = models.CharField(max_length=100, default="Ghana")
    business_hours = models.CharField(max_length=255, blank=True, default="Mon - Fri: 8:00 AM - 5:00 PM")
    google_maps_embed_url = models.TextField(blank=True)

    instagram_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    instagram_url = models.URLField(default="https://instagram.com/eshagbuildingandconst")
    tiktok_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    tiktok_url = models.URLField(default="https://tiktok.com/@eshagbuildingandconst")
    youtube_handle = models.CharField(max_length=100, default="@eshagbuildingandconst")
    youtube_url = models.URLField(default="https://www.youtube.com/@eshagbuildingandconst")
    facebook_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    favicon = models.ImageField(upload_to='branding/', blank=True, null=True)
    footer_text = models.TextField(
        default="ESHAG Building and Construction is committed to delivering excellence, precision, and durability across all commercial and residential developments."
    )

    class Meta:
        app_label = 'core'
        verbose_name = "Company Settings"
        verbose_name_plural = "Company Settings"

    def __str__(self):
        return f"{self.company_name} - Global Settings"

    def save(self, *args, **kwargs):
        if not self.pk and CompanySettings.objects.exists():
            self.pk = CompanySettings.objects.first().pk
        super().save(*args, **kwargs)


class SiteStatistic(TimeStampedModel):
    label = models.CharField(max_length=100)
    value = models.PositiveIntegerField(default=0)
    suffix = models.CharField(max_length=10, blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'core'
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.label}: {self.value}{self.suffix}"


class AuditLog(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100, db_index=True)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        app_label = 'core'
        ordering = ['-created_at']

    def __str__(self):
        username = self.user.username if self.user else "System"
        return f"[{self.created_at}] {username}: {self.action}"


class FAQ(TimeStampedModel):
    """
    Frequently Asked Questions displayed on the homepage, quote, and FAQ pages.
    """
    class Category(models.TextChoices):
        GENERAL = 'general', 'General'
        PRICING = 'pricing', 'Pricing & Quotes'
        PROCESS = 'process', 'Construction Process'
        MATERIALS = 'materials', 'Materials & Quality'
        TIMELINES = 'timelines', 'Project Timelines'

    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.GENERAL, db_index=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        app_label = 'core'
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return self.question


class TeamMember(TimeStampedModel):
    """
    Key personnel, site engineers, project managers, and leadership.
    """
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='team/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        app_label = 'core'
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} — {self.role}"