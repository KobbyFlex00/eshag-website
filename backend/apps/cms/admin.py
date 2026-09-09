from django.contrib import admin
from .models import Page, PageSection


class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 1
    fields = ('section_key', 'heading', 'subheading', 'content', 'display_order', 'is_active')


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'published_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'slug', 'hero_headline')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PageSectionInline]


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = ('heading', 'page', 'section_key', 'display_order', 'is_active')
    list_editable = ('display_order', 'is_active')
    list_filter = ('page', 'is_active')
    search_fields = ('heading', 'content', 'section_key')