from django.contrib import admin
from .models import CompanySettings, SiteStatistic, AuditLog, FAQ, TeamMember


@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'primary_phone', 'secondary_phone', 'updated_at')

    def has_add_permission(self, request):
        if CompanySettings.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(SiteStatistic)
class SiteStatisticAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'suffix', 'display_order', 'is_active')
    list_editable = ('value', 'suffix', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('label',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'user', 'action', 'model_name', 'ip_address')
    list_filter = ('action', 'model_name', 'created_at')
    search_fields = ('description', 'user__username', 'object_id')
    readonly_fields = ('user', 'action', 'model_name', 'object_id', 'description', 'ip_address', 'created_at')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'display_order', 'is_active')
    list_editable = ('display_order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('question', 'answer')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'display_order', 'is_active')
    list_editable = ('display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'role', 'bio')