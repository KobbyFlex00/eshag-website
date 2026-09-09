from django.contrib import admin
from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('title', 'media_type', 'file_size', 'created_at', 'uploaded_by')
    list_filter = ('media_type', 'created_at')
    search_fields = ('title', 'alt_text', 'caption')
    readonly_fields = ('file_size', 'created_at', 'updated_at')

    def save_model(self, request, obj, form, change):
        if not obj.uploaded_by:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)