from django.contrib import admin
from .models import bikes
from leaflet.admin import LeafletGeoAdmin

# Register your models here.
admin.site.register(bikes, admin.ModelAdmin)