from multiprocessing.managers import BaseManager
from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('ENUMERATOR', 'Enumerator'),
        ('F_SUPERVISOR', 'Field Supervisor'),
        ('TEAM_LEADER', 'Team Leader'),
        ('SURVEY_MANAGER', 'Survey Manager'),
        ("F_SUPPERVISOR", "F_SUPPERVISOR"),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ENUMERATOR')
    is_temporary_password = models.BooleanField(default=True)

    # Fix reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    # Survey assignments
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
    survey_types = models.JSONField(
        blank=True,
        default=list,
        help_text="Choose survey types assigned to the user"
    )
    surveys = models.ManyToManyField(
        'surveys_app.Survey',
        blank=True,
        related_name='assigned_users'
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = BaseManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return f"{self.email} ({self.role})"


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    must_change_password = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
