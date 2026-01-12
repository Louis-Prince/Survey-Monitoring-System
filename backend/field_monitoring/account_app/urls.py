from django.urls import path
from . import views
from .views import create_user_view, assign_survey_view
from.views import list_users,LoginView,ForgotPasswordView,ResetPasswordConfirmView,ChangePasswordView

urlpatterns = [
    # path("users/create/", create_user_view),
    path('users/create/', create_user_view, name='create-user'),
    path('create/', create_user_view),
    path('assign-survey/', assign_survey_view),
    
    path('users/', list_users),  # API endpoint
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('create-user/', views.create_user_api, name='create-user'),
    #path('users/create/', create_user_api),
    # path('users/create/', create_user_view, name='create-user'),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path('login/', LoginView.as_view(), name='login'),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path('password-reset-confirm/', ResetPasswordConfirmView.as_view(), name='password-reset-confirm')
]


