from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role & Contact', {'fields': ('role', 'phone_number', 'is_verified')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role & Contact', {'fields': ('role', 'phone_number', 'email')}),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'department', 'receive_email_notifications', 'created_at')
    search_fields = ('user__username', 'user__email', 'job_title', 'department')