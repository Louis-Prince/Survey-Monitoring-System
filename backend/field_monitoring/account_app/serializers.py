from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Profile

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
