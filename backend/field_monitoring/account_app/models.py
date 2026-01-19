from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
from django.db import models

from django.db.models import F

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    must_change_password = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('ENUMERATOR', 'Enumerator'),
        ("F_SUPPERVISOR","F_SUPPERVISOR"),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ENUMERATOR')

    # Fix reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # << rename to avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set_permissions',  # << rename to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

