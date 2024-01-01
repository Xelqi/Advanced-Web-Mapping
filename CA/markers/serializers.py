from markers.models import bikes
from rest_framework import serializers


class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = bikes
        fields = ("id", "name", "address", "latitude", "longitude", "geom")
        extra_kwargs = {
            "geom": {"read_only": True},
            "latitude": {"read_only": True},
            "longitude": {"read_only": True},
        }