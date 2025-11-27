from django.shortcuts import render
from django.http import HttpResponse

from .models import Nationality


def index(request):
    nationalites = Nationality.objects.order_by("-probability")
    return render(request, "index.html", {"nationalities": nationalites})
