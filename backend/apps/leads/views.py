from rest_framework import generics, viewsets, permissions, status, filters, parsers
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.core.permissions import IsStaffOrAdminUser
from .models import Lead, ContactMessage, QuoteRequest, LeadNote, LeadActivity
from .serializers import (
    LeadSerializer, ContactSubmissionSerializer,
    QuoteSubmissionSerializer, LeadNoteSerializer
)


class SubmitContactView(generics.CreateAPIView):
    """
    Public endpoint for contact inquiries (/api/v1/leads/contact/).
    Automatically registers a CRM Lead in PostgreSQL.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ContactSubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Thank you for contacting ESHAG. Your inquiry has been received."
        }, status=status.HTTP_201_CREATED)


class SubmitQuoteView(generics.CreateAPIView):
    """
    Public endpoint for quote requests (/api/v1/leads/quote/).
    Supports file attachments (drawings, PDFs).
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = QuoteSubmissionSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Your quote request has been submitted successfully. Our estimation team will review your specifications."
        }, status=status.HTTP_201_CREATED)


class LeadViewSet(viewsets.ModelViewSet):
    """
    Internal CRM management for authorized staff and sales personnel.
    """
    permission_classes = [IsStaffOrAdminUser]
    serializer_class = LeadSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'inquiry_type', 'source', 'assigned_to']
    search_fields = ['full_name', 'email', 'phone', 'company', 'project_location']
    ordering_fields = ['created_at', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        return Lead.objects.all().select_related('assigned_to').prefetch_related('lead_notes', 'activities')

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()
        if old_status != instance.status:
            LeadActivity.objects.create(
                lead=instance,
                performed_by=self.request.user,
                action=f"Status changed from {old_status} to {instance.status}",
                details=f"Updated by {self.request.user.username}"
            )