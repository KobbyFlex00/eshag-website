from django.contrib import admin
from .models import Service, ServiceFeature


class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 2
    fields = ('title', 'description', 'display_order')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'status', 'featured', 'display_order', 'created_at')
    list_editable = ('featured', 'display_order')
    list_filter = ('status', 'featured')
    search_fields = ('name', 'short_description', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ServiceFeatureInline]


@admin.register(ServiceFeature)
class ServiceFeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'service', 'display_order')
    list_filter = ('service',)
    search_fields = ('title', 'description')