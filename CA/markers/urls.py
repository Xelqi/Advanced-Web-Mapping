from django.urls import path
from .views import HomePageView, MapPageView, get_bike_data, register_view, update_user_location, delete_user
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', HomePageView, name='home'),
    path('map', MapPageView, name='map'),
    path('bike_data/', get_bike_data, name='bike_data'),
    path('register/', register_view, name='register'),
    path('login', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('update_user_location/', update_user_location, name='update_location'),
    path('delete/', delete_user, name='delete'),
]