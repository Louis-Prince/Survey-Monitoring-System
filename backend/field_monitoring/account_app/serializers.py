from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from .models import Profile
from surveys_app.models import Survey

User = get_user_model()


class ChangePasswordSerializer(serializers.Serializer):
    """
    Allows authenticated user to change password ONCE
    after first login using token authentication.
    """
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        # Ensure profile exists
        profile, created = Profile.objects.get_or_create(
            user=user,
            defaults={"must_change_password": True}
        )

        # Allow only once
        if not profile.must_change_password:
            raise serializers.ValidationError(
                "Password has already been changed. Please login."
            )

        # Passwords must match
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(
                {"confirm_new_password": "Passwords do not match"}
            )

        # Validate strength
        validate_password(attrs["new_password"], user)

        attrs["profile"] = profile
        return attrs

    def save(self):
        user = self.context["request"].user
        profile = self.validated_data["profile"]

        user.set_password(self.validated_data["new_password"])
        user.is_temporary_password = False
        user.save()

        profile.must_change_password = False
        profile.save(update_fields=["must_change_password"])

        return user


class UserSerializer(serializers.ModelSerializer):
    surveys = serializers.PrimaryKeyRelatedField(
        queryset=Survey.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'survey_types', 'surveys', 'is_active', 'is_staff']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "success": False,
                "error": "Invalid email or password"
            })

        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError({
                "success": False,
                "error": "Invalid email or password"
            })

        data["user"] = user
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        uid = urlsafe_base64_decode(data["uid"]).decode()
        user = User.objects.get(pk=uid)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, data["token"]):
            raise serializers.ValidationError({
                "success": False,
                "error": "Invalid or expired token"
            })

        self.user = user
        return data

    def save(self):
        self.user.set_password(self.validated_data["new_password"])
        self.user.save()
