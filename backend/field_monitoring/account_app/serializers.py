from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Profile
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

User = get_user_model()

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer responsible for forcing a user to change their password
    after first login using a generated (temporary) password.
    """
    # User email (used to identify which user is changing password)
    # New password entered by the user and Confirmation of the new password
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True) 
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Performs all validations before saving the new password:
        1. Checks if user exists
        2. Ensures user is required to change password
        3. Confirms both passwords match
        4. Enforces password strength rules from settings.py
        """

        # Check if user exists and Get the user's profile
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        profile = Profile.objects.get(user=user)

        # Ensure password change is required
        if not profile.must_change_password:
            raise serializers.ValidationError(
                "Password already changed. Please login."
            )

        # Check if new password and confirmation match
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError("Passwords do not match")

        # Validate password strength (min 8 chars, uppercase, lowercase,
        #     number, special character — based on settings.py validators)
        validate_password(data["new_password"], user)

        # Attach objects for use in save()
        data["user"] = user
        data["profile"] = profile
        return data

    def save(self):
        """
        Saves the new password and updates the profile flag
        so the user is no longer forced to change password.
        """

        user = self.validated_data["user"]
        profile = self.validated_data["profile"]

        # Set and hash the new password
        user.set_password(self.validated_data["new_password"])
        user.save()

        # Mark password change as completed
        profile.must_change_password = False
        profile.save()

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'is_staff']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        data["user"] = user
        return data

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        # 🔍 DEBUG START
        print("UIDB64:", data["uid"])
        # 🔍 DEBUG END

        uid = urlsafe_base64_decode(data["uid"]).decode()

        # 🔍 DEBUG START
        print("Decoded UID:", uid)
        # 🔍 DEBUG END

        user = User.objects.get(pk=uid)

        # 🔍 DEBUG START
        print("User ID:", user.id)
        print("User Email:", user.email)
        print("Token received:", data["token"])
        # 🔍 DEBUG END

        token_generator = PasswordResetTokenGenerator()

        # 🔍 DEBUG START
        is_valid = token_generator.check_token(user, data["token"])
        print("Token valid?:", is_valid)
        # 🔍 DEBUG END

        if not is_valid:
            raise serializers.ValidationError("Invalid or expired token")

        self.user = user
        return data

    def save(self):
        self.user.set_password(self.validated_data["new_password"])
        self.user.save()

    

