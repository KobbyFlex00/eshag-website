import math
from django.db import models
from django.utils.text import slugify
from django.conf import settings
from apps.core.models import TimeStampedModel, SEOBasedModel, PublishableModel


class BlogCategory(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True, db_index=True)
    description = models.TextField(blank=True)

    class Meta:
        app_label = 'blog'
        verbose_name_plural = 'Blog Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogTag(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)

    class Meta:
        app_label = 'blog'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(TimeStampedModel, SEOBasedModel, PublishableModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blog_posts'
    )
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tags = models.ManyToManyField(BlogTag, blank=True, related_name='posts')

    excerpt = models.CharField(max_length=300, help_text="Brief summary for listings and preview cards")
    content = models.TextField(help_text="Complete article markdown/HTML content")
    featured_image = models.ImageField(upload_to='blog/%Y/%m/', blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    read_time_minutes = models.PositiveIntegerField(default=3)

    class Meta:
        app_label = 'blog'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.content:
            word_count = len(self.content.split())
            self.read_time_minutes = max(1, math.ceil(word_count / 200))
        super().save(*args, **kwargs)