from django.urls import path
from .views import (
    list_users_view,
    create_user_view,      
    change_password_view,
    me_view,
    assign_survey_view,
    login_view
)

urlpatterns = [
    path('users/', list_users_view, name='list_users'),
    path('create/', create_user_view, name='create_user'),  # <-- updated
    path('change-password/', change_password_view, name='change_password'),
    path('me/', me_view, name='me'),
    path('assign-survey/', assign_survey_view, name='assign_survey'),
    path('login/', login_view, name='login'),
]


