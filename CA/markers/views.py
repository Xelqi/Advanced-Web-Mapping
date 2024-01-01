from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import TemplateView, CreateView, DeleteView
from .models import bikes, UserProfile
from .serializers import BikeSerializer
from rest_framework import generics
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import MultiPoint
from geopy.geocoders import Nominatim

class HomePageView(TemplateView):
    template_name = 'index2.html'
    
class OfflineView(TemplateView):
    template_name = 'offline.html'

class MapPageView(TemplateView):
    template_name = 'map.html'
    
class Subscription(TemplateView):
    template_name = 'subscription.html'
 
class GetStarted(TemplateView):
    template_name = 'get_started.html'
    
class Members(TemplateView):
    template_name = 'members.html'

class RegisterView(CreateView):
    template_name = 'registration/register.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('map')

    def form_valid(self, form):
        response = super().form_valid(form)
        UserProfile.objects.create(user=self.object)
        login(self.request, self.object)
        return response

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

        return redirect('index2')  # Redirect to the index page or any other desired page

    return render(request, 'index2.html')

geolocator = Nominatim(user_agent="location")

class BikeListCreateView(generics.ListCreateAPIView):
    queryset = bikes.objects.all()
    serializer_class = BikeSerializer

    def perform_create(self, serializer):
        address = serializer.initial_data.get("address")
        if address:
            g = geolocator.geocode(address)
            if g:
                lat = g.latitude
                lng = g.longitude
                pnt = Point(lng, lat)
                multi_point = MultiPoint(pnt)
                
                # Assign latitude, longitude, and geom before saving
                serializer.validated_data["latitude"] = lat
                serializer.validated_data["longitude"] = lng
                serializer.validated_data["geom"] = multi_point
                
        serializer.save()

class BikeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = bikes.objects.all()
    serializer_class = BikeSerializer

    def perform_update(self, serializer):
        address = serializer.initial_data.get("address")
        if address:
            g = geolocator.geocode(address)
            if g:
                lat = g.latitude
                lng = g.longitude
                pnt = Point(lng, lat)
                multi_point = MultiPoint(pnt)
                serializer.validated_data["latitude"] = lat
                serializer.validated_data["longitude"] = lng
                serializer.validated_data["geom"] = multi_point
                
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()