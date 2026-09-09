from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel, SEOBasedModel, PublishableModel


class Page(TimeStampedModel, SEOBasedModel, PublishableModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    hero_headline = models.CharField(max_length=255, blank=True)
    hero_subheadline = models.TextField(blank=True)
    hero_cta_text = models.CharField(max_length=100, blank=True)
    hero_cta_url = models.CharField(max_length=255, blank=True)
    hero_image = models.ImageField(upload_to='cms/heroes/', blank=True, null=True)

    class Meta:
        app_label = 'cms'
        ordering = ['title']

    def __str__(self):
        return f"{self.title} (/{self.slug})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class PageSection(TimeStampedModel):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='sections')
    section_key = models.CharField(max_length=100, help_text="e.g., 'why_choose_us', 'our_process', 'intro'")
    heading = models.CharField(max_length=200)
    subheading = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'cms'
        ordering = ['display_order', 'created_at']
        unique_together = ('page', 'section_key')

    def __str__(self):
        return f"{self.page.title} — {self.heading}"