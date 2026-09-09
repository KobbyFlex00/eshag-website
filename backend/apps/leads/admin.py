from django.contrib import admin
from .models import Lead, LeadNote, LeadActivity, ContactMessage, QuoteRequest


class LeadNoteInline(admin.TabularInline):
    model = LeadNote
    extra = 1
    fields = ('author', 'note', 'created_at')
    readonly_fields = ('created_at',)


class LeadActivityInline(admin.TabularInline):
    model = LeadActivity
    extra = 0
    fields = ('performed_by', 'action', 'details', 'created_at')
    readonly_fields = ('performed_by', 'action', 'details', 'created_at')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'phone', 'email', 'inquiry_type',
        'status', 'priority', 'source', 'assigned_to', 'created_at'
    )
    list_editable = ('status', 'priority', 'assigned_to')
    list_filter = ('status', 'priority', 'inquiry_type', 'source', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'company', 'project_location')
    inlines = [LeadNoteInline, LeadActivityInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'subject', 'is_processed', 'created_at')
    list_filter = ('is_processed', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'email', 'phone', 'project_type',
        'project_location', 'estimated_budget', 'is_processed', 'created_at'
    )
    list_filter = ('project_type', 'is_processed', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'project_location', 'project_description')