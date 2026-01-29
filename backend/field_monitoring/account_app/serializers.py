
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Profile       
from surveys_app.models import Survey 
from rest_framework import serializers
from .models import User
from surveys_app.models import Survey
import random
import string
from django.core.mail import send_mail
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile
from surveys_app.models import Survey

User = get_user_model()

# USER SERIALIZER
# =========================
class UserSerializer(serializers.ModelSerializer):
    surveys = serializers.PrimaryKeyRelatedField(
        queryset=Survey.objects.all(),  # M2M field
        many=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'surveys',
        ]
        read_only_fields = ['id']


# CHANGE PASSWORD SERIALIZER
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError("New passwords must match.")
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        if not user.check_password(self.validated_data['old_password']):
            raise serializers.ValidationError("Old password is incorrect.")
        user.set_password(self.validated_data['new_password'])
        user.save()
        if hasattr(user, 'profile'):
            user.profile.must_change_password = False
            user.profile.save()
        return user



# CREATE USER SERIALIZER (ADMIN)
# =========================
class UserCreateSerializer(serializers.ModelSerializer):
    surveys = serializers.PrimaryKeyRelatedField(
        queryset=Survey.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'surveys'
        ]

    def create(self, validated_data):
        surveys_data = validated_data.pop('surveys', [])
        # Generate random password
        from django.utils.crypto import get_random_string
        password = get_random_string(10)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.role = validated_data.get('role', 'ENUMERATOR')
        user.save()

        # Attach surveys
        if surveys_data:
            user.surveys.set(surveys_data)

        # Create profile with must_change_password
        from .models import Profile
        Profile.objects.create(user=user, must_change_password=True)

        # Send email
        from django.core.mail import send_mail
        from django.conf import settings

        send_mail(
            subject="Your Account Has Been Created",
            message=f"""
Hello {user.first_name or user.username},

Your account has been created.

Login details:
Username: {user.username}
Temporary Password: {password}

Please login and change your password immediately.

Regards,
Admin Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user
