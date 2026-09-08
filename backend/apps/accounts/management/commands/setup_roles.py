from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from accounts.models import User


class Command(BaseCommand):
    help = "Sets up standard RBAC groups corresponding to ESHAG business roles."

    ROLES = [
        User.Role.SUPER_ADMIN,
        User.Role.ADMIN,
        User.Role.CONTENT_MANAGER,
        User.Role.SALES,
        User.Role.PROJECT_MANAGER,
        User.Role.HR_MANAGER,
        User.Role.STAFF,
    ]

    def handle(self, *args, **options):
        self.stdout.write("Initializing RBAC groups...")
        for role_name in self.ROLES:
            group, created = Group.objects.get_or_create(name=role_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"  + Created Group: {role_name}"))
            else:
                self.stdout.write(f"  - Group already exists: {role_name}")

        self.stdout.write(self.style.SUCCESS("[OK] RBAC groups setup complete."))