# root URL
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # needed for simple home view
from rest_framework.authtoken.views import obtain_auth_token

def home(request):
    return HttpResponse("Welcome to the Field Monitoring System!")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    # path('api/', include('account_app.urls')),   #ONLY THIS
    path('api/accounts/', include('account_app.urls')),
    path('api/auth/', include('account_app.urls')),
    path("api/token/", obtain_auth_token)
]
   

