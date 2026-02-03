from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from surveys_app.models import Survey, SurveyTask
from .serializers import (
    ChangePasswordSerializer,
    UserSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    ResetPasswordConfirmSerializer
)

User = get_user_model()

# -------------------------------
# Helper function
# -------------------------------
def is_admin(user):
    return user.is_staff or getattr(user, "role", None) == 'ADMIN'

# -------------------------------
# Home
# -------------------------------
def home_view(request):
    return HttpResponse("Welcome to the Field Monitoring System!")

# -------------------------------
# Authentication & Login
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    user = authenticate(request, email=email, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    login(request, user)
    return Response({"message": "Login successful"}, status=200)

class LoginView(APIView):
    permission_classes = [AllowAny]

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
                "is_temporary_password": getattr(user, "is_temporary_password", True),
                "role": getattr(user, "role", None),
            }
        }, status=status.HTTP_200_OK)

# -------------------------------
# Logout
# -------------------------------
def logout_view(request):
    logout(request)
    return redirect('login')

# -------------------------------
# User registration
# -------------------------------
def register_view(request):
    return render(request, 'account_app/register.html')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user_api(request):
    email = request.data.get('email')
    username = request.data.get('username')
    if not email or not username:
        return Response({"error": "email and username required"}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    from django.utils.crypto import get_random_string
    password = get_random_string(8)
    user = User.objects.create_user(username=username, email=email, password=password)

    send_mail(
        subject="Your Account Credentials",
        message=f"Username: {username}\nPassword: {password}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({
        "message": "User created successfully",
        "user": UserSerializer(user).data
    })

# -------------------------------
# Password management
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Password changed successfully"}, status=200)
    return Response(serializer.errors, status=400)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password changed successfully. Please login."}, status=200)
        return Response(serializer.errors, status=400)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

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
            pass

        return Response({"success": True, "message": "If this email exists, a password reset link has been sent."}, status=200)

class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Password reset successful"}, status=200)
        return Response(serializer.errors, status=400)

# -------------------------------
# User management
# -------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def list_users_view(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    email = request.query_params.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    return Response(UserSerializer(user).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user_view(request):
    data = request.data
    email = data.get("email")
    username = data.get("username")
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    role = data.get("role", "ENUMERATOR")
    survey_types = data.get("surveys", [])
    send_invite = data.get("send_email_invitation", True)

    if not username or User.objects.filter(username=username).exists():
        return Response({"success": False, "message": "Username required or already exists"}, status=400)
    if not email or User.objects.filter(email=email).exists():
        return Response({"success": False, "message": "Email required or already exists"}, status=400)

    from django.utils.crypto import get_random_string
    password = get_random_string(10)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=role,
        is_active=True
    )
    if survey_types:
        user.survey_types = survey_types
    user.save()

    if send_invite:
        send_mail(
            subject="Your Account Credentials",
            message=f"Hello {first_name},\n\nYour account has been created.\nEmail: {email}\nPassword: {password}\n\nRegards,\nAdmin Team",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

    return Response({"success": True, "message": "User created successfully", "data": UserSerializer(user).data}, status=201)

# -------------------------------
# Survey assignment
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def assign_survey_view(request):
    user_id = request.data.get("user_id")
    survey_ids = request.data.get("survey_ids", [])

    if not user_id:
        return Response({"error": "user_id is required"}, status=400)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    surveys = Survey.objects.filter(id__in=survey_ids)
    user.surveys.set(surveys)

    return Response({"message": "Surveys assigned successfully"})
