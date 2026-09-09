from django.db import models
from django.utils.text import slugify
from django.conf import settings
from apps.core.models import TimeStampedModel, SEOBasedModel, PublishableModel


class JobPosting(TimeStampedModel, SEOBasedModel, PublishableModel):
    """
    Career opportunities, trade positions, and engineering roles.
    """
    class EmploymentType(models.TextChoices):
        FULL_TIME = 'full_time', 'Full-Time'
        PART_TIME = 'part_time', 'Part-Time'
        CONTRACT = 'contract', 'Contract'
        INTERNSHIP = 'internship', 'Internship'

    class ExperienceLevel(models.TextChoices):
        ENTRY = 'entry', 'Entry Level'
        MID = 'mid', 'Mid Level (2-5 yrs)'
        SENIOR = 'senior', 'Senior (5+ yrs)'
        LEAD = 'lead', 'Lead / Management'

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    department = models.CharField(max_length=100, help_text="e.g., Civil Engineering, Project Management, Masonry")
    location = models.CharField(max_length=150, default="Accra, Ghana")
    employment_type = models.CharField(
        max_length=30,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
        db_index=True
    )
    experience_level = models.CharField(
        max_length=30,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.MID,
        db_index=True
    )
    description = models.TextField(help_text="Role summary and overview")
    responsibilities = models.TextField(help_text="Itemized key duties")
    requirements = models.TextField(help_text="Required qualifications and experience")
    benefits = models.TextField(blank=True, help_text="Company perks and allowances")
    application_deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        app_label = 'careers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_employment_type_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class JobApplication(TimeStampedModel):
    """
    Candidate job applications submitted through /careers.
    """
    class ApplicationStatus(models.TextChoices):
        NEW = 'new', 'New'
        REVIEWED = 'reviewed', 'Reviewed'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        INTERVIEW = 'interview', 'Interview Scheduled'
        REJECTED = 'rejected', 'Rejected'
        HIRED = 'hired', 'Hired'

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    resume = models.FileField(upload_to='resumes/%Y/%m/')
    cover_letter = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    years_of_experience = models.PositiveSmallIntegerField(default=0)
    
    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.NEW,
        db_index=True
    )
    internal_notes = models.TextField(blank=True, help_text="Confidential notes for HR/Hiring managers")
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_applications'
    )

    class Meta:
        app_label = 'careers'
        ordering = ['-created_at']

    def __str__(self):
        return f"Application: {self.full_name} for {self.job.title}"