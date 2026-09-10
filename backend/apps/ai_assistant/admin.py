from django.contrib import admin
from .models import EstimatorSubmission, ChatMessage


@admin.register(EstimatorSubmission)
class EstimatorSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'project_category', 'floor_area_sqm', 'floors',
        'finish_quality', 'estimated_total_low', 'estimated_total_high',
        'contact_name', 'created_at'
    )
    list_filter = ('project_category', 'finish_quality', 'created_at')
    search_fields = ('contact_name', 'contact_email', 'contact_phone')
    readonly_fields = (
        'estimated_materials_cost', 'estimated_labor_cost',
        'estimated_management_cost', 'estimated_total_low',
        'estimated_total_high', 'created_at'
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'sender', 'content_preview', 'created_at')
    list_filter = ('sender', 'created_at')
    search_fields = ('session_id', 'content')
    readonly_fields = ('session_id', 'sender', 'content', 'created_at')

    def content_preview(self, obj):
        return obj.content[:80] + "..." if len(obj.content) > 80 else obj.content
    content_preview.short_description = "Message"