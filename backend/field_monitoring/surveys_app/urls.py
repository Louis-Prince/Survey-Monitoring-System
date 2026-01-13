# surveys_app/urls.py
from django.urls import path
from . import views  # import views muri surveys_app

urlpatterns = [
    path('tasks/', views.task_list_view, name='task_list'),
    path('tasks/<int:id>/', views.task_detail_view, name='task_detail'),
]
