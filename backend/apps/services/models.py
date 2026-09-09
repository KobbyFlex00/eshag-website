from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel, SEOBasedModel, PublishableModel


class Service(TimeStampedModel, SEOBasedModel, PublishableModel):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    featured_image = models.ImageField(upload_to='services/', blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        app_label = 'services'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ServiceFeature(TimeStampedModel):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='features')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = 'services'
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.service.name} — {self.title}"