
# # from .models import User, Profile, Survey
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import User, Profile
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from surveys_app.models import Survey
from django.contrib.auth.models import AbstractUser, UserManager

    
class CustomUserCreationForm(forms.ModelForm):
    survey_types = forms.MultipleChoiceField(
        choices=User.SURVEY_TYPE_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'role',
            'phone_number',
            'survey_types',
            'is_active',
        ]

    def save(self, commit=True):
        user = super().save(commit=False)

        # 🔑 AUTO-GENERATE USERNAME
        base_username = self.cleaned_data['email'].split('@')[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user.username = username

        if commit:
            user.set_password(User.objects.make_random_password())
            user.save()
            self.save_m2m()

        return user

# Profile Inline
# -------------------------
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

# User Admin
# -------------------------
class CustomUserAdmin(BaseUserAdmin):
    # form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = User
    # inlines = (ProfileInline,)  # optional

    list_display = ('email', 'username', 'first_name', 'last_name', 'phone_number','role')
    list_filter = ('role', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Role & Surveys', {'fields': ('role', 'survey_types', )}),  # checkboxes for survey_types
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name','role','phone_number','survey_types'),
        }),
         (('Permissions'), {
            'fields': (
                'is_active',
                'groups',
                'user_permissions',
            )
        }),
        (('Important dates'), {'fields': ('last_login',)}),
    )
    

    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('surveys',)
    
    
# Register Admin
# -------------------------
admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)
admin.site.register(Survey)  # optional


