# from rest_framework.views import APIView

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from surveys_app.models import Survey
from .serializers import UserSerializer, ChangePasswordSerializer

User = get_user_model()

# LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, email=email, password=password)

    if not user:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response({
        "message": "Login successful",
        "user": UserSerializer(user).data,
        # 🔹 INFO only (no force)
        "password_change_optional": True
    })

# CHANGE PASSWORD (OPTIONAL)
@api_view(['POST'])
@permission_classes([AllowAny])
def change_password_view(request):
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={"request": request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# CREATE USER (ADMIN)
@api_view(['POST'])
@permission_classes([AllowAny])  # 🔹 no auth required (backend only)
def create_user_view(request):
    data = request.data

    email = data.get("email")
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    role = data.get("role", "ENUMERATOR")
    # surveys = data.get("surveys", [])
    survey_types = data.get("surveys", [])
    send_invite = data.get("send_email_invitation", True)
    
    username = data.get("username")

    if not username:
     return Response(
        { 
            "success": False,
            "error": "Username is required"},
        status=status.HTTP_400_BAD_REQUEST
    )

    if User.objects.filter(username=username).exists():
     return Response(
        {
            "success": False,
            "message": "Username already exists",
            # "data": {"username": username}
        },
        status=status.HTTP_400_BAD_REQUEST
    )

# Check if email is provided
    if not email:
     return Response(
        {
            "success": False,
            "message": "Email is required"
        },
        status=status.HTTP_400_BAD_REQUEST
    )

# Check email uniqueness
    if User.objects.filter(email=email).exists():
     return Response(
        {
            "success": False,
            # "data": {"email": email},
            "message": "User with this email already exists",
            # "data": {"email": email}
        },
        status=status.HTTP_400_BAD_REQUEST
    )
   

    # 🔐 Generate password
    password = get_random_string(10)

    #  Create user
    user = User.objects.create_user(
        username=username, 
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=role,
        is_active=True
    )

   #  Assign survey_types (custom User field)
    survey_types = data.get("surveys", [])  # or rename key to "survey_types"
    if survey_types:
     user.survey_types = survey_types
    user.save()
     
    # ✉️ Send email (optional)
    if send_invite:
        send_mail(
            subject="Your Account Credentials",
            message=f"""
Hello {first_name},

Your account has been created successfully.

Login credentials:
Email: {email}
Password: {password}

You may continue using this password or change it anytime after login.

Regards,
Admin Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
        {
            "success": True,
            "message": "User created successful",
            "data": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "surveys": user.survey_types
            }
        },
        status=status.HTTP_201_CREATED
        )


# LIST USERS

@api_view(['GET'])
@permission_classes([AllowAny])
def list_users_view(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)


# CURRENT USER (OPTIONAL)
@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    email = request.query_params.get("email")

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(UserSerializer(user).data)


# ASSIGN SURVEYS

@api_view(['POST'])
@permission_classes([AllowAny])
def assign_survey_view(request):
    user_id = request.data.get("user_id")
    survey_ids = request.data.get("survey_ids", [])

    if not user_id:
        return Response(
            {"error": "user_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    surveys = Survey.objects.filter(id__in=survey_ids)
    user.surveys.set(surveys)

    return Response({"message": "Surveys assigned successfully"})



