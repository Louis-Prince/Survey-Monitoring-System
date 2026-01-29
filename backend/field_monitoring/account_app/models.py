from django.conf import settings
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save 
from django.dispatch import receiver 
from django.contrib.auth.models import AbstractUser, Group, Permission, User 
from django.db.models import F 
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('ENUMERATOR', 'Enumerator'),
        ('F_SUPERVISOR', 'Field Supervisor'),
        ('TEAM_LEADER', 'Team Leader'),
        ('SURVEY_MANAGER', 'Survey Manager'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20, blank=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='ENUMERATOR'
    )
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

    #####aho mpinduye
    surveys = models.ManyToManyField(
    'surveys_app.Survey',
    blank=True,
    related_name='assigned_users'  
)

    # surveys = models.ManyToManyField(
    #     'surveys_app.Survey',
    #     blank=True,
    #     related_name='users'
    # )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    objects = UserManager()

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


