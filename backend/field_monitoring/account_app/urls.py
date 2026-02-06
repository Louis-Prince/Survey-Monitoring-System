from django.urls import path
from . import views
from .views import (
    create_user_view, create_user_api, list_users_view,
    update_user, delete_user, me_view, assign_survey_view,
    ChangePasswordView, LoginView, ForgotPasswordView,
    ResetPasswordConfirmView
)

urlpatterns = [
    path('create/', create_user_view, name='create_user_simple'),
    path('create-user/', create_user_api, name='create_user_api'),
    path('users/', list_users_view, name='list_users'),
    path('update-user/<int:user_id>/', update_user, name='update_user'),
    path('delete-user/<int:user_id>/', delete_user, name='delete_user'),
    path('me/', me_view, name='me'),
    path('assign-survey/', assign_survey_view, name='assign_survey'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('password-reset-confirm/', ResetPasswordConfirmView.as_view(), name='password_reset_confirm'),
]
