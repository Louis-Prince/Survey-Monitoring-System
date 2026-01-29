 # Create your models here.
from django.db import models
from account_app.models import User
from django.conf import settings
from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings  # <-- use this instead of direct import

class Survey(models.Model):

    SURVEY_TYPE_CHOICES = (
        ('HEALTH', 'Health'),
        ('AGRICULTURE', 'Agriculture'),
        ('EDUCATION', 'Education'),
        ('ENVIRONMENT', 'Environment'),
        ('HEALTH', 'LFS'),
        ('AGRICULTURE', 'SAS'),
        ('EDUCATION', 'EICV'),
        ('ENVIRONMENT', 'household'),
    )
    

    title = models.CharField(max_length=200)
    survey_type = models.CharField(max_length=50, choices=SURVEY_TYPE_CHOICES)
    description = models.TextField(blank=True)

    # M2M relation to User
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='assigned_surveys',  # <-- change this to something unique
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title




