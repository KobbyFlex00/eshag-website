from rest_framework import viewsets, permissions, parsers
from .models import MediaAsset
from .serializers import MediaAssetSerializer
from apps.core.permissions import IsStaffOrAdminUser


class MediaAssetViewSet(viewsets.ModelViewSet):
    """
    Manage media uploads. Read available to staff; mutation restricted to staff/admin.
    """
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsStaffOrAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)