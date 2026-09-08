import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    """
    Custom user model for ESHAG platform.
    Uses email as a secondary unique identifier.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)

    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')
        ADMIN = 'ADMIN', _('Admin')
        CONTENT_MANAGER = 'CONTENT_MANAGER', _('Content Manager')
        SALES = 'SALES', _('Sales / Business Development')
        PROJECT_MANAGER = 'PROJECT_MANAGER', _('Project Manager')
        HR_MANAGER = 'HR_MANAGER', _('HR Manager')
        STAFF = 'STAFF', _('Staff')

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.STAFF,
        db_index=True
    )
    phone_number = models.CharField(max_length=30, blank=True)
    is_verified = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['email']

    class Meta:
        app_label = 'accounts'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# Alias for backward compatibility across imports
User = CustomUser


class Profile(models.Model):
    """
    User profile for bio, avatar, and notification preferences.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    job_title = models.CharField(max_length=120, blank=True)
    department = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    receive_email_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'accounts'

    def __str__(self):
        return f"Profile of {self.user.username}"