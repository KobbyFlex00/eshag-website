from django.contrib import admin
from .models import Notification, EmailLog


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'level', 'is_read', 'created_at')
    list_editable = ('is_read',)
    list_filter = ('level', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    actions = ['mark_as_read']

    @admin.action(description="Mark selected notifications as read")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('recipient', 'subject', 'body', 'error_message')
    readonly_fields = ('recipient', 'subject', 'body', 'status', 'error_message', 'created_at')