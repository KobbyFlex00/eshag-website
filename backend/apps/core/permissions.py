from rest_framework import permissions
from accounts.models import CustomUser


class IsStaffOrAdminUser(permissions.BasePermission):
    """
    Allows access only to authenticated staff or business users with an assigned operational role.
    """
    ALLOWED_ROLES = [
        CustomUser.Role.SUPER_ADMIN,
        CustomUser.Role.ADMIN,
        CustomUser.Role.CONTENT_MANAGER,
        CustomUser.Role.SALES,
        CustomUser.Role.PROJECT_MANAGER,
        CustomUser.Role.HR_MANAGER,
    ]

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True
        return request.user.role in self.ALLOWED_ROLES