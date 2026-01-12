from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # needed for simple home view

# Simple home page view
def home(request):
    return HttpResponse("Welcome to the Field Monitoring System!")

urlpatterns = [
    path('', home, name='home'),
    path("account/", include("account_app.urls")),
    path("admin/", admin.site.urls),
    path('api/accounts/', include('account_app.urls')),
    path('api/auth/', include('account_app.urls')),
]
   
# root URL

