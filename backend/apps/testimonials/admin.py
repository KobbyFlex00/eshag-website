from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'client_title', 'rating', 'is_approved', 'featured', 'display_order', 'created_at')
    list_editable = ('is_approved', 'featured', 'display_order')
    list_filter = ('is_approved', 'featured', 'rating', 'created_at')
    search_fields = ('client_name', 'company_name', 'quote')
    actions = ['approve_testimonials', 'feature_testimonials']

    @admin.action(description="Approve selected testimonials")
    def approve_testimonials(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description="Feature selected testimonials")
    def feature_testimonials(self, request, queryset):
        queryset.update(featured=True)