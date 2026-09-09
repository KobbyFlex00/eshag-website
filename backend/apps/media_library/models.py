import uuid
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class MediaAsset(TimeStampedModel):
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        DOCUMENT = 'document', 'Document/PDF'
        VIDEO = 'video', 'Video'

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='media_library/%Y/%m/')
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    media_type = models.CharField(max_length=20, choices=MediaType.choices, default=MediaType.IMAGE)
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_assets'
    )

    class Meta:
        app_label = 'media_library'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            try:
                self.file_size = self.file.size
            except (AttributeError, FileNotFoundError):
                pass
        super().save(*args, **kwargs)