from rest_framework import viewsets, generics, permissions, filters, status, parsers
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.core.permissions import IsStaffOrAdminUser
from .models import JobPosting, JobApplication
from .serializers import (
    JobPostingListSerializer, JobPostingDetailSerializer,
    JobApplicationSubmissionSerializer, JobApplicationDetailSerializer
)


class PublicJobPostingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public catalog of open positions at ESHAG.
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'employment_type', 'experience_level']
    search_fields = ['title', 'department', 'description', 'requirements']
    ordering_fields = ['created_at', 'application_deadline']
    ordering = ['-created_at']

    def get_queryset(self):
        return JobPosting.objects.filter(is_active=True, status=JobPosting.Status.PUBLISHED)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobPostingDetailSerializer
        return JobPostingListSerializer


class SubmitJobApplicationView(generics.CreateAPIView):
    """
    Public endpoint for candidates submitting their resume and application.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = JobApplicationSubmissionSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Your application has been received successfully. Our hiring team will review your qualifications."
        }, status=status.HTTP_201_CREATED)


class HRJobApplicationViewSet(viewsets.ModelViewSet):
    """
    Internal pipeline management for HR Managers and Administrators.
    """
    permission_classes = [IsStaffOrAdminUser]
    serializer_class = JobApplicationDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'job']
    search_fields = ['full_name', 'email', 'phone', 'internal_notes']
    ordering_fields = ['created_at', 'years_of_experience']
    ordering = ['-created_at']

    def get_queryset(self):
        return JobApplication.objects.all().select_related('job', 'reviewed_by')

    def perform_update(self, serializer):
        serializer.save(reviewed_by=self.request.user)