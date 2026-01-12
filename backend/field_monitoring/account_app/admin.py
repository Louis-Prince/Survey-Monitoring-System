from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "must_change_password")
# from django.contrib import admin

from .models import User             # Custom User model
from surveys_app.models import SurveyTask  # Import SurveyTask FROM surveys_app

# Admin kuri User
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')

# Admin kuri SurveyTask
@admin.register(SurveyTask)
class SurveyTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'created_at')
    list_filter = ('assigned_to',)
    search_fields = ('title',)

# Reba niba SurveyTask iriho
try:
    from surveys_app.models import SurveyTask
except ImportError:
    print("SurveyTask ntabwo iboneka muri surveys_app.models")


