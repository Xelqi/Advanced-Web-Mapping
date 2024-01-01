from django.urls import path
from .views import GetStarted, HomePageView, MapPageView, Members, OfflineView, Subscription, RegisterView, delete_user, BikeListCreateView, BikeRetrieveUpdateDestroyView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', HomePageView.as_view(), name='index2'),
    path('get-started/', GetStarted.as_view(), name='get-started'),
    path('subscriptions/', Subscription.as_view(), name='subscriptions'),
    path('map/', MapPageView.as_view(), name='map'),
    path('members/', Members.as_view(), name='members'),
    path('offline/', OfflineView.as_view(), name='offline'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('delete/', delete_user, name='delete'),
    path('bikes/', BikeListCreateView.as_view(), name='bike-list-create'),
    path('bikes/<int:pk>/', BikeRetrieveUpdateDestroyView.as_view(), name='bike-retrieve-update-destroy'),
]
