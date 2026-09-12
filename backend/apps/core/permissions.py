from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()


class IsStaffOrAdminUser(permissions.BasePermission):
    """
    Allows access to staff, superusers, or admin-level roles.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_staff or user.is_superuser:
            return True

        user_role = getattr(user, 'role', None)
        if hasattr(User, 'Role'):
            return user_role in [
                User.Role.SUPER_ADMIN,
                User.Role.ADMIN,
                User.Role.STAFF,
                getattr(User.Role, 'PROJECT_MANAGER', 'PROJECT_MANAGER'),
            ]

        return False


class IsAdminUserOnly(permissions.BasePermission):
    """
    Allows access strictly to superusers and SUPER_ADMIN roles.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        user_role = getattr(user, 'role', None)
        if hasattr(User, 'Role'):
            return user_role == User.Role.SUPER_ADMIN

        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission allowing only the owner to edit.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, 'user', None) == request.user or getattr(obj, 'owner', None) == request.user


class ReadOnly(permissions.BasePermission):
    """
    Allows read-only requests.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS