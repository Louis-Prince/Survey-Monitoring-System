

# surveys_app/views.py
from django.http import HttpResponse

def task_list_view(request):
    return HttpResponse("List of survey tasks")

def task_detail_view(request, id):
    return HttpResponse(f"Survey task detail {id}")
