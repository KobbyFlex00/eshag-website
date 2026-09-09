from django.contrib import admin
from .models import JobPosting, JobApplication


class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    fields = ('full_name', 'email', 'phone', 'years_of_experience', 'status', 'created_at')
    readonly_fields = ('full_name', 'email', 'phone', 'years_of_experience', 'created_at')
    show_change_link = True


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'department', 'employment_type', 'experience_level',
        'location', 'is_active', 'status', 'application_deadline'
    )
    list_editable = ('is_active', 'status')
    list_filter = ('is_active', 'status', 'employment_type', 'experience_level', 'department')
    search_fields = ('title', 'department', 'description', 'requirements')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [JobApplicationInline]


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'job', 'email', 'phone',
        'years_of_experience', 'status', 'created_at'
    )
    list_editable = ('status',)
    list_filter = ('status', 'job', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'cover_letter', 'internal_notes')
    readonly_fields = ('full_name', 'email', 'phone', 'resume', 'cover_letter', 'portfolio_url', 'years_of_experience', 'created_at')