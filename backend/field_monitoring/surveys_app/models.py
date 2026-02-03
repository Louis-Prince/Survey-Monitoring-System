from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class Survey(models.Model):
    SURVEY_TYPE_CHOICES = (
        ('HEALTH', 'Health'),
        ('AGRICULTURE', 'Agriculture'),
        ('EDUCATION', 'Education'),
        ('ENVIRONMENT', 'Environment'),
        ('LFS', 'LFS'),
        ('SAS', 'SAS'),
        ('EICV', 'EICV'),
        ('HOUSEHOLD', 'Household'),
    )

    owner = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name='owned_surveys',
    null=True,      # allow nulls for existing rows
    blank=True      # allow form fields to be empty
)
    title = models.CharField(max_length=200)
    survey_type = models.CharField(max_length=50, choices=SURVEY_TYPE_CHOICES)
    description = models.TextField(blank=True)

users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='assigned_surveys',
        blank=True
    )

created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)

def __str__(self):
        return self.title
