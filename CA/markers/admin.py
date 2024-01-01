from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import bikes

@admin.register(bikes)
class BikeAdmin(LeafletGeoAdmin):
    list_display = ("id", "name", "address", "latitude", "longitude", "created_at", "updated_at")
