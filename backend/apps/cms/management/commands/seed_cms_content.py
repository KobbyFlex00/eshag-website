from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.cms.models import Page, PageSection
from apps.services.models import Service, ServiceFeature


class Command(BaseCommand):
    help = "Seeds initial verified CMS homepage copy, process steps, and default construction services."

    def handle(self, *args, **options):
        self.stdout.write("Seeding CMS Homepage structure...")

        home_page, _ = Page.objects.get_or_create(
            slug="home",
            defaults={
                "title": "Home",
                "hero_headline": "Building Dreams. Constructing Futures.",
                "hero_subheadline": "Delivering excellence in residential, commercial, and infrastructure construction with unmatched precision, durability, and craftsmanship.",
                "hero_cta_text": "Request a Quote",
                "hero_cta_url": "/request-quote",
                "status": Page.Status.PUBLISHED,
                "published_at": timezone.now(),
                "seo_title": "ESHAG Building & Construction — Building Dreams. Constructing Futures.",
                "seo_description": "Premier construction and civil engineering services. Residential, commercial, renovation, and professional project management in Ghana.",
            }
        )

        sections = [
            {
                "key": "intro",
                "heading": "Excellence in Construction & Civil Works",
                "subheading": "About ESHAG",
                "content": "ESHAG Building and Construction is committed to transforming visions into durable realities. We adhere to the highest engineering standards and transparent client communication.",
                "order": 1,
            },
            {
                "key": "process",
                "heading": "Our Proven Construction Process",
                "subheading": "Structured from Start to Finish",
                "content": "1. Consultation | 2. Planning | 3. Design & Preparation | 4. Construction | 5. Inspection | 6. Handover",
                "order": 2,
            },
            {
                "key": "why_choose_us",
                "heading": "Why Partner With ESHAG",
                "subheading": "Quality & Integrity",
                "content": "Quality workmanship, professional project management, reliability, attention to detail, and durable construction.",
                "order": 3,
            },
        ]

        for s in sections:
            PageSection.objects.get_or_create(
                page=home_page,
                section_key=s["key"],
                defaults={
                    "heading": s["heading"],
                    "subheading": s["subheading"],
                    "content": s["content"],
                    "display_order": s["order"],
                    "is_active": True,
                }
            )

        self.stdout.write(self.style.SUCCESS("[OK] CMS Homepage and sections initialized."))

        self.stdout.write("Seeding verified starting services...")
        initial_services = [
            {
                "name": "Residential Construction",
                "short_description": "Custom modern homes, multi-family residences, and private residential developments built with enduring quality.",
                "description": "Comprehensive residential building services covering design realization, structural foundation, masonry, roofing, and turnkey finishing.",
                "icon": "Home",
                "display_order": 1,
                "features": ["Architectural realization", "Turnkey masonry & roofing", "Foundation engineering"],
            },
            {
                "name": "Commercial Construction",
                "short_description": "Office buildings, retail facilities, and specialized commercial spaces tailored to modern business requirements.",
                "description": "Structural construction optimized for durability, regulatory compliance, and functional workflow.",
                "icon": "Building2",
                "display_order": 2,
                "features": ["Reinforced concrete structures", "Commercial interiors", "Safety-certified execution"],
            },
            {
                "name": "Renovation & Remodeling",
                "short_description": "Transforming and modernizing existing properties with structural reinforcement and premium finishes.",
                "description": "Complete restoration, expansion, structural repairs, and contemporary interior and exterior overhauls.",
                "icon": "Hammer",
                "display_order": 3,
                "features": ["Structural reinforcement", "Space reconfiguration", "Modern interior updates"],
            },
            {
                "name": "Project Management",
                "short_description": "End-to-end site oversight, procurement coordination, and quality assurance for on-time delivery.",
                "description": "Rigorous supervisory project management ensuring adherence to budget, schedules, and safety protocols.",
                "icon": "ClipboardCheck",
                "display_order": 4,
                "features": ["Site supervision", "Quality control audits", "Timeline & budget tracking"],
            },
            {
                "name": "Construction Consultation & Support",
                "short_description": "Technical guidance, site feasibility evaluations, and cost estimation support for your project.",
                "description": "Pre-construction advisory services helping prospective clients make informed technical and logistical decisions.",
                "icon": "HardHat",
                "display_order": 5,
                "features": ["Site feasibility reviews", "Material recommendations", "Technical evaluation"],
            },
        ]

        for svc_data in initial_services:
            features = svc_data.pop("features")
            svc, created = Service.objects.get_or_create(
                name=svc_data["name"],
                defaults={
                    **svc_data,
                    "status": Service.Status.PUBLISHED,
                    "published_at": timezone.now(),
                    "featured": True,
                }
            )
            if created:
                for idx, feat in enumerate(features):
                    ServiceFeature.objects.create(
                        service=svc,
                        title=feat,
                        display_order=idx + 1
                    )
                self.stdout.write(self.style.SUCCESS(f"  + Added Service: {svc.name}"))
            else:
                self.stdout.write(f"  - Service already exists: {svc.name}")

        self.stdout.write(self.style.SUCCESS("[COMPLETED] CMS & Services baseline seeding finished."))