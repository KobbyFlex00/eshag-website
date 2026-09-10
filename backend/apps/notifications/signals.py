from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.leads.models import ContactMessage, QuoteRequest
from apps.careers.models import JobApplication
from .models import Notification

User = get_user_model()


def notify_management(title, message, link_url, level=Notification.Level.INFO):
    """
    Creates notifications for Super Admins and Admins.
    """
    staff_users = User.objects.filter(is_staff=True)
    notifications = [
        Notification(
            user=user,
            title=title,
            message=message,
            link_url=link_url,
            level=level
        )
        for user in staff_users
    ]
    if notifications:
        Notification.objects.bulk_create(notifications)


@receiver(post_save, sender=ContactMessage)
def on_contact_message_received(sender, instance, created, **kwargs):
    if created:
        notify_management(
            title=f"New Contact Message: {instance.subject}",
            message=f"Received message from {instance.name} ({instance.email}).",
            link_url="/admin/leads/contactmessage/",
            level=Notification.Level.INFO
        )


@receiver(post_save, sender=QuoteRequest)
def on_quote_request_received(sender, instance, created, **kwargs):
    if created:
        notify_management(
            title=f"New Quote Request: {instance.project_type}",
            message=f"{instance.full_name} submitted a quotation request in {instance.project_location}.",
            link_url="/admin/leads/quoterequest/",
            level=Notification.Level.SUCCESS
        )


@receiver(post_save, sender=JobApplication)
def on_job_application_received(sender, instance, created, **kwargs):
    if created:
        notify_management(
            title=f"New Application: {instance.job.title}",
            message=f"{instance.full_name} applied for {instance.job.title}.",
            link_url="/admin/careers/jobapplication/",
            level=Notification.Level.INFO
        )