from django.contrib.gis.db import models as geo_models# GeoDjango Model API
from django.db import models
from django.contrib.auth.models import User


class bikes(geo_models.Model):
    number = geo_models.CharField(max_length=80)
    name = geo_models.CharField(max_length=255)
    address = geo_models.CharField(max_length=255)
    latitude = geo_models.FloatField()
    longitude = geo_models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    geom = geo_models.MultiPointField(srid=4326)

    def __str__(self):
        return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)