from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group, Permission
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# -----------------------------
# Custom User Manager
# -----------------------------
class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, username=None, role='ENUMERATOR', password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        if not username:
            username = email.split('@')[0]
        user = self.model(email=email, username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not password:
            raise ValueError("Superuser must have a password")
        return self.create_user(email, username=username, password=password, **extra_fields)

# -----------------------------
# User Model
# -----------------------------
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
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    is_temporary_password = models.BooleanField(default=True)

    # Permissions
    groups = models.ManyToManyField(Group, related_name='custom_user_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set_permissions', blank=True)

    # Surveys
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
    survey_types = models.JSONField(blank=True, default=list)
    surveys = models.ManyToManyField('surveys_app.Survey', blank=True, related_name='assigned_users')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()  # ✅ Correct manager

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return f"{self.email} ({self.role})"

# -----------------------------
# Profile Model
# -----------------------------
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    must_change_password = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
