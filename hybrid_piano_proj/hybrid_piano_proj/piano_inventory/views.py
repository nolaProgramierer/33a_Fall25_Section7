from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.views.generic import TemplateView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required

import json

# Django Rest Framework
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.forms import ModelForm

from piano_inventory.serializers import PianoSerializer, CommentSerializer
from .models import User, Piano, Comment


class AddPiano(ModelForm):
    class Meta:
        model = Piano
        fields = ['brand', 'price', 'size', 'imageUrl']
    
    # Add bootstrap to input fields of ModelForm
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Loop through form fields and add a class for Bootstrap styling
        for field_name, field in self.fields.items():
            widget = field.widget
            widget.attrs['class'] = widget.attrs.get('class', '') + ' form-control'


@ensure_csrf_cookie
def init_csrf(request):
    return JsonResponse({"status": "ok"})


# -------------------------------------------------- #
# Class-based view
# -------------------------------------------------- #

# Render the index template
class IndexWebpack(TemplateView):
    template_name = "piano_inventory/index_inventory.html"


# -------------------------------------------------- #
# Function based views
# -------------------------------------------------- #

# Renders home page
def index(request):
    return render(request, "piano_inventory/index.html")


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        # email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "piano_inventory/login.html", {
                "message": "Invalid username and/or password."})
    else:
        return render(request, "piano_inventory/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
       
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "piano_inventory/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "piano_inventory/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    return render(request, "piano_inventory/register.html")


@api_view(['GET', 'POST'])
def piano_list(request):
    """
    List all pianos, or create a new piano.
    """
    if request.method == 'GET':
        # Retrieve Django model object
        pianos = Piano.objects.all()
        # Create instance of serializer class & convert Python native data type
        serializer = PianoSerializer(pianos, many=True) # Allows query sets
       
        return Response(serializer.data)

    elif request.method == 'POST':
        # Parse JSON response into native Python data types w/ DRF
        data = request.data
        # Set the owner of the piano 
        data["owner"] = request.user.id
        # Convert Python data to an instance of serializer class
        serializer = PianoSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            # Serializer instance to Python data type passed to JSON
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'PUT', 'DELETE'])
def piano_detail(request, pk):
    """
    Retrieve, update or delete a piano.
    """  
    piano = get_object_or_404(Piano, pk=pk)

    if request.method == 'GET':
        # New instance of 'PianoSerializer with the piano object
        serializer = PianoSerializer(piano)
        # Converts to a Python dictionary
        data = serializer.data
        # To compare logged in user with piano owner in React Details.js component
        data["current_user_id"] = request.user.id
        # Data is returned as a JSON reponse
        return Response(data)
        
    elif request.method == 'PUT':
        # Ensure owner field cannot be changed by frontend
        data = request.data.copy()
        data["owner"] = request.user.id
        # A Piano serializer object is created
        serializer = PianoSerializer(piano, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        if request.user != piano.owner:
            return Response({"error": "Forbidden"}, status=403)
        
        piano.delete()
        return Response(status=204)


@api_view(['GET', 'POST'])
def comment(request):
    """
    List all comments, or create a comment
    """
    if request.method == 'GET':
        piano_id = request.GET.get("piano")

        if piano_id:
            comments = Comment.objects.filter(piano_id=piano_id).order_by("-created_at")
        else:
            comments = Comment.objects.all()

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        data["commenter"] = request.user.id
        serializer = CommentSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)


# Create a piano object synchronously with Django form template
@login_required
def add_piano(request):
    if request.method == "POST":
        form = AddPiano(request.POST)
        if form.is_valid():
            piano_form = form.save(commit=False)
            piano_form.owner = request.user
            piano_form.save()
            return HttpResponseRedirect(reverse('index_inventory'))
    form = AddPiano()
    return render(request, 'piano_inventory/add_piano.html', {'form': form})



