# from django.contrib.auth import authenticate
# from django.contrib.auth import get_user_model
# from django.shortcuts import get_object_or_404
# from .models import SurveyTask
# import random, string

# User = get_user_model()

# # -----------------------------
# # Permission check
# # -----------------------------
# def admin_required(user):
#     if not user.is_staff:
#         raise PermissionError("Admin only action")

# # -----------------------------
# # Admin: Add user
# # -----------------------------
# def add_user(admin_user, username, email):
#     admin_required(admin_user)

#     if User.objects.filter(username=username).exists():
#         return {"error": "Username already exists"}

#     temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

#     user = User.objects.create_user(
#         username=username,
#         email=email,
#         password=temp_password,
#         is_active=True
#     )

#     return {
#         "username": username,
#         "temp_password": temp_password
#     }

# # -----------------------------
# # Admin: Delete user
# # -----------------------------
# def delete_user(admin_user, user_id):
#     admin_required(admin_user)

#     user = get_object_or_404(User, id=user_id)
#     user.delete()

#     return {"status": "deleted"}

# # -----------------------------
# # Admin: Assign user to survey
# # -----------------------------
# def assign_user_to_survey(admin_user, user_id, survey_id):
#     admin_required(admin_user)

#     user = get_object_or_404(User, id=user_id)
#     survey = get_object_or_404(SurveyTask, id=survey_id)

#     survey.assigned_to = user
#     survey.save()

#     return {
#         "survey": survey.title,
#         "assigned_to": user.username
#     }

# # -----------------------------
# # User Login
# # -----------------------------
# def user_login(username, password):
#     user = authenticate(username=username, password=password)

#     if not user:
#         return {"status": "failed"}

#     if not user.is_active:
#         return {"status": "inactive"}

#     return {
#         "status": "success",
#         "user_id": user.id,
#         "role": user.role
#     }

# surveys_app/views.py
from django.http import HttpResponse

def task_list_view(request):
    return HttpResponse("List of survey tasks")

def task_detail_view(request, id):
    return HttpResponse(f"Survey task detail {id}")
