from django.contrib import admin
from django.utils.html import format_html
from .models import Project, ProjectImage, ProjectUpdate


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3
    fields = ['image', 'caption', 'display_order', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"


class ProjectUpdateInline(admin.StackedInline):
    model = ProjectUpdate
    extra = 1
    fields = ['title', 'percentage_complete', 'description', 'update_date']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'project_type', 'project_status', 'location', 'featured', 'status', 'published_at', 'featured_preview']
    list_filter = ['project_type', 'project_status', 'featured', 'status']
    search_fields = ['title', 'location', 'client_name', 'project_code']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline, ProjectUpdateInline]
    ordering = ['display_order', '-created_at']

    def featured_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return "-"
    featured_preview.short_description = "Cover"


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'caption', 'display_order', 'preview']
    list_filter = ['project']
    search_fields = ['caption', 'project__title']

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "-"
    preview.short_description = "Thumbnail"