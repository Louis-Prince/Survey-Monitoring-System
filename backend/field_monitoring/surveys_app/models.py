

# # Create your models here.
# from django.db import models
# from django.contrib.auth.models import AbstractUser

# surveys_app/models.py

from django.db import models
from account_app.models import User

class SurveyTask(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# # Custom User Model

# class User(AbstractUser):

#     ROLE_CHOICES = (
#         ('ADMIN', 'Admin'),
#         ('ENUMERATOR', 'Enumerator'),
#         ('SUPERVISOR', 'Supervisor'),
#     )

#     role = models.CharField(
#         max_length=20,
#         choices=ROLE_CHOICES,
#         default='ENUMERATOR'
#     )

#     phone_number = models.CharField(
#         max_length=15,
#         blank=True,
#         null=True
#     )

#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return f"{self.username} ({self.role})"


# # -------------------------
# # Survey Task Model
# # -------------------------
# class SurveyTask(models.Model):

#     STATUS_CHOICES = (
#         ('PENDING', 'Pending'),
#         ('IN_PROGRESS', 'In Progress'),
#         ('COMPLETED', 'Completed'),
#     )

#     title = models.CharField(max_length=100)
#     description = models.TextField()

#     assigned_to = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='assigned_surveys'
#     )

#     created_by = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name='created_surveys'
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='PENDING'
#     )

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     is_active = models.BooleanField(default=True)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Survey Task"
#         verbose_name_plural = "Survey Tasks"

#     def __str__(self):
#         return f"{self.title} - {self.status}"
