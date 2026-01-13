from django.urls import path
from .views import ChangePasswordView

urlpatterns = [
    
]

from . import views
from .views import create_user_view, login_view, change_password_view
from .views import create_user_view, login_view, change_password_view, assign_survey_view
from.views import list_users

urlpatterns = [
    # path("users/create/", create_user_view),
    path('users/create/', create_user_view, name='create-user'),
    path('create/', create_user_view),
    path('login/', login_view),
    # path('change-password/', change_password_view),
    path('assign-survey/', assign_survey_view),
    
    # path('users/', list_users),  # API endpoint
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('create-user/', views.create_user_api, name='create-user'),
    #path('users/create/', create_user_api),
    # path('users/create/', create_user_view, name='create-user'),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
