from django.contrib import admin
from .models import CompanySettings, SiteStatistic


@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'primary_phone', 'secondary_phone', 'updated_at')

    def has_add_permission(self, request):
        # Prevent creating multiple instances
        if CompanySettings.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(SiteStatistic)
class SiteStatisticAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'suffix', 'display_order', 'is_active')
    list_editable = ('value', 'suffix', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('label',)