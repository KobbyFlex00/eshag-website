from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class Notification(TimeStampedModel):
    """
    In-app alerts for dashboard users (lead arrivals, quote submissions, applications).
    """
    class Level(models.TextChoices):
        INFO = 'info', 'Info'
        SUCCESS = 'success', 'Success'
        WARNING = 'warning', 'Warning'
        CRITICAL = 'critical', 'Critical'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    level = models.CharField(
        max_length=20,
        choices=Level.choices,
        default=Level.INFO,
        db_index=True
    )
    link_url = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)

    class Meta:
        app_label = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_level_display()}] {self.title} -> {self.user.username}"


class EmailLog(TimeStampedModel):
    """
    Audit ledger tracking automated email dispatches and delivery statuses.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SENT = 'sent', 'Sent'
        FAILED = 'failed', 'Failed'

    recipient = models.EmailField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    error_message = models.TextField(blank=True)

    class Meta:
        app_label = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"Email to {self.recipient}: {self.subject} ({self.status})"