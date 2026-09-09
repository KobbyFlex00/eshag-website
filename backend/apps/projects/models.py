from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel, SEOBasedModel, PublishableModel


class Project(TimeStampedModel, SEOBasedModel, PublishableModel):
    class ProjectType(models.TextChoices):
        RESIDENTIAL = 'residential', 'Residential'
        COMMERCIAL = 'commercial', 'Commercial'
        RENOVATION = 'renovation', 'Renovation'
        REMODELING = 'remodeling', 'Remodeling'
        INFRASTRUCTURE = 'infrastructure', 'Infrastructure'
        OTHER = 'other', 'Other'

    class ProjectStatus(models.TextChoices):
        PLANNED = 'planned', 'Planned'
        ONGOING = 'ongoing', 'Ongoing'
        COMPLETED = 'completed', 'Completed'
        MAINTENANCE = 'maintenance', 'Maintenance'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    project_code = models.CharField(max_length=50, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    
    project_type = models.CharField(
        max_length=30,
        choices=ProjectType.choices,
        default=ProjectType.RESIDENTIAL,
        db_index=True
    )
    project_status = models.CharField(
        max_length=30,
        choices=ProjectStatus.choices,
        default=ProjectStatus.ONGOING,
        db_index=True
    )
    location = models.CharField(max_length=255)
    client_name = models.CharField(max_length=255, blank=True)
    
    start_date = models.DateField(null=True, blank=True)
    expected_completion_date = models.DateField(null=True, blank=True)
    completion_date = models.DateField(null=True, blank=True)

    featured_image = models.ImageField(upload_to='projects/featured/', blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        app_label = 'projects'
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_project_status_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProjectImage(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        app_label = 'projects'
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"Gallery image for {self.project.title}"


class ProjectUpdate(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    description = models.TextField()
    percentage_complete = models.PositiveIntegerField(default=0)
    update_date = models.DateField()
    published = models.BooleanField(default=True, db_index=True)

    class Meta:
        app_label = 'projects'
        ordering = ['-update_date', '-created_at']

    def __str__(self):
        return f"{self.project.title} — {self.title} ({self.percentage_complete}%)"