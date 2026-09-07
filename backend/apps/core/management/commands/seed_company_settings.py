from django.core.management.base import BaseCommand
from apps.core.models import CompanySettings, SiteStatistic


class Command(BaseCommand):
    help = "Seed initial verified ESHAG company settings and statistical metric templates."

    def handle(self, *args, **options):
        self.stdout.write("Checking CompanySettings...")
        settings, created = CompanySettings.objects.get_or_create(
            company_name="ESHAG Building and Construction",
            defaults={
                "brand_name": "ESHAG",
                "tagline": "Building Dreams. Constructing Futures.",
                "primary_domain": "https://eshag.construction",
                "primary_phone": "059 953 5884",
                "secondary_phone": "024 139 5502",
                "whatsapp_number": "059 953 5884",
                "email": "info@eshag.construction",
                "city": "Accra",
                "region": "Greater Accra",
                "country": "Ghana",
                "instagram_handle": "@eshagbuildingandconst",
                "instagram_url": "https://instagram.com/eshagbuildingandconst",
                "tiktok_handle": "@eshagbuildingandconst",
                "tiktok_url": "https://tiktok.com/@eshagbuildingandconst",
                "youtube_handle": "@eshagbuildingandconst",
                "youtube_url": "https://www.youtube.com/@eshagbuildingandconst",
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS("[OK] Created default ESHAG CompanySettings."))
        else:
            self.stdout.write(self.style.WARNING("[INFO] CompanySettings already exist. Skipped."))

        self.stdout.write("Seeding baseline statistic placeholders (values default to 0)...")
        default_stats = [
            {"label": "Years of Experience", "value": 0, "suffix": "+", "display_order": 1},
            {"label": "Projects Completed", "value": 0, "suffix": "+", "display_order": 2},
            {"label": "Ongoing Projects", "value": 0, "suffix": "", "display_order": 3},
            {"label": "Satisfied Clients", "value": 0, "suffix": "+", "display_order": 4},
        ]

        for item in default_stats:
            stat, stat_created = SiteStatistic.objects.get_or_create(
                label=item["label"],
                defaults={
                    "value": item["value"],
                    "suffix": item["suffix"],
                    "display_order": item["display_order"],
                    "is_active": True
                }
            )
            if stat_created:
                self.stdout.write(self.style.SUCCESS(f"  + Added stat placeholder: {stat.label}"))

        self.stdout.write(self.style.SUCCESS("[COMPLETED] Baseline company data seeded successfully."))