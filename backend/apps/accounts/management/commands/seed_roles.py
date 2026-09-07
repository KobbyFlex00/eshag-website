from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = "Seed standard ESHAG RBAC groups into Django."

    def handle(self, *args, **options):
        roles = [
            "Super Admin",
            "Admin",
            "Content Manager",
            "Sales / Business Development",
            "Project Manager",
            "HR Manager",
            "Staff"
        ]

        self.stdout.write("Configuring RBAC groups...")
        for role_name in roles:
            group, created = Group.objects.get_or_create(name=role_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"  + Created Group: {role_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"  - Group exists: {role_name}"))

        self.stdout.write(self.style.SUCCESS("[OK] All RBAC groups are ready."))