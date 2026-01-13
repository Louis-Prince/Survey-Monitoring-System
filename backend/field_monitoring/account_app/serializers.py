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
    email = serializers.EmailField()
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        # 1. Check user exists
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        # 2. Check old password
        if not user.check_password(data["old_password"]):
            raise serializers.ValidationError("Invalid email or password")

        # 3. Check new passwords match
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError("New passwords do not match")

        # 4. Validate password strength (settings.py rules)
        validate_password(data["new_password"], user)

        data["user"] = user
        return data

    def save(self):
        user = self.validated_data["user"]
        new_password = self.validated_data["new_password"]

        user.set_password(new_password)
        user.save()

        # Update profile flag
        profile = Profile.objects.get(user=user)
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

    

