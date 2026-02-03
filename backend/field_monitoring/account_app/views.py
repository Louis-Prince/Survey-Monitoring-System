from rest_framework.views import APIView
from rest_framework import status
from .serializers import ChangePasswordSerializer, UserSerializer,LoginSerializer,ForgotPasswordSerializer,ResetPasswordConfirmSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
import random, string
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate, login,logout
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.mail import send_mail
from surveys_app.models import SurveyTask
from django.http import HttpResponse
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
import json 
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.permissions import IsAuthenticated
from .utils import determine_dashboard

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # 🔥 REQUIRED

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password changed successfully. Please login."},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Check if user is admin
def is_admin(user):
    return user.is_staff or user.role == 'ADMIN'

# User change password

# def change_password_view(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "POST required"}, status=405)

#     new_password = request.POST.get("new_password")
#     if not new_password:
#         return JsonResponse({"error": "Missing password"}, status=400)

#     user = request.user
#     user.set_password(new_password)
#     user.save()
#     return JsonResponse({"status": "success", "message": "Password updated"})

# Admin assigns survey to user
@login_required
@user_passes_test(is_admin)
def assign_survey_view(request):
    user_id = request.POST.get("user_id")
    survey_id = request.POST.get("survey_id")

    user = get_object_or_404(User, id=user_id)
    survey = get_object_or_404(SurveyTask, id=survey_id)

    survey.assigned_to = user
    survey.save()

    # Send notification email
    send_mail(
        subject="Survey Assignment",
        message=f"Hello {user.username},\n\nYou have been assigned to survey: {survey.title}",
        from_email="admin@example.com",
        recipient_list=[user.email],
        fail_silently=False
    )

    return JsonResponse({
        "status": "success",
        "survey": survey.title,
        "assigned_to": user.username
    })

#list of user
@api_view(['GET'])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# field_monitoring/views.py 

def home_view(request):
    return HttpResponse("Welcome to the Field Monitoring System!")
User = get_user_model()

# def home(request):
#     return HttpResponse("Welcome to the Field Monitoring System!")
# # account_app/views.py

def logout_view(request):
    logout(request)
    return redirect('login')

def register_view(request):
    # your registration logic here IF NEEDED
    return render(request, 'account_app/register.html')

# def register_view(request):
#     return HttpResponse("Register Page")


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user_api(request):
    email = request.data.get('email')
    username = request.data.get('username')

    if not email or not username:
        return Response({"error": "email and username required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    # Generate password
    password = get_random_string(8)

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # Send email
    send_mail(
        subject="Your Account Credentials",
        message=f"Username: {username}\nPassword: {password}",
        from_email="admin@fieldmonitoring.com",
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({
        "message": "User created successfully",
        "username": username,
        "email": email
    })


User = get_user_model()

def create_user_and_send_email(username, email):
    password = get_random_string(8)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    send_mail(
        subject='Your Field Monitoring Account',
        message=f'Username: {username}\nPassword: {password}',
        from_email='admin@example.com',
        recipient_list=[email],
        fail_silently=False,
    )

    return user

def generate_random_password(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


@csrf_exempt
def create_user_view(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "This endpoint only accepts POST requests"},
            status=405
        )
        
    data = json.loads(request.body)

    username = data.get("username")
    email = data.get("email")
    role = data.get("role", "Enumerator")

    if not username or not email:
        return JsonResponse(
            {"error": "username and email are required"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"error": "Username already exists"},
            status=400
        )

    password = generate_random_password()

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    user.role = role
    user.is_active = True
    user.save()

    # 📧 Send email
    send_mail(
        subject="Your Account Has Been Created",
        message=f"""
Hello {username},

Your account has been created.

Login details:
Username: {username}
Password: {password}

Please  you can login with that password or  can change your password as you want.

Regards,
Admin Team
""",
    from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

    return JsonResponse(
        {"message": "User created and email sent successfully"},
        status=201
    )




class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Login successful",
            "data": {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "email": user.email,
                "is_temporary_password": user.is_temporary_password,
                "Role": user.role,
            }
        }, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]  # Public endpoint

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)

            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password:\n{reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # Do not reveal user existence

        return Response(
            {
                "success": True,
                "message": "If this email exists, a password reset link has been sent."
            },
            status=status.HTTP_200_OK,
        )
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    
                    "success": True,
                    "message": "Password reset successful"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

