from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .models import bikes, UserProfile

# Create your views here.
# Passing our template as a class
def HomePageView(request):
    return render (request,'index.html')

def MapPageView(request):
    return render(request, 'map.html')

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        # username = request.POST['username']
        # password = request.POST['password1']
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            login(request, user)
            return redirect('map')  # Redirect to a profile page or any other page
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

#  Update user location

def update_user_location(request):
    if request.method == 'POST':
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')

        user_profile = request.user.userprofile
        user_profile.latitude = latitude
        user_profile.longitude = longitude
        user_profile.save()

        return JsonResponse({'message': 'Location updated successfully'+ 'Your latitude is :' + latitude + 'Your longitude is :' + longitude})

    return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_bike_data(request):
    bike_data = bikes.objects.values('name', 'address', 'latitude', 'longitude')
    return JsonResponse(list(bike_data), safe=False)

def delete_user(request):
    if request.method == 'POST':
        user = request.user
        user_profile = user.userprofile
        user_profile.delete()  # This deletes the user's profile
        user.delete() # This deletes the user account
        # Log the user out (optional)
        logout(request)

        # Show a message to confirm the deletion (optional)
        messages.success(request, 'Your account has been deleted.')

        return redirect('home')  # Redirect to the index page or any other desired page

    return render(request, 'index.html')