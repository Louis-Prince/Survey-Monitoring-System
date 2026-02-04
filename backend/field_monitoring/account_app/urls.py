from django.urls import path
from . import views
from .views import (
    list_users_view,
    create_user_view,
    me_view,
    assign_survey_view,
    LoginView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
    ChangePasswordView
)

urlpatterns = [
    # Function-based views
    path('create/', create_user_view, name='create_user_simple'),

    path('users/', list_users_view, name='list_users'),
    path('users/create/', create_user_view, name='create_user'),
    path('me/', me_view, name='me'),
    path('assign-survey/', assign_survey_view, name='assign_survey'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('create-user/', views.create_user_api, name='create_user_api'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('password-reset-confirm/', ResetPasswordConfirmView.as_view(), name='password_reset_confirm'),
]
