from pathlib import Path
import os
from django.contrib.gis.utils import LayerMapping
from .models import bikes

# Updated `LayerMapping` dictionary for Lakes model
bikes_mapping = {
    'number': 'Number',
    'name': 'Name',
    'address': 'Address',
    'latitude': 'Latitude',
    'longitude': 'Longitude',
    'geom': 'MULTIPOINT',
}


bikes_shp = Path(__file__).resolve().parent /'data'/'dublin-point.shp'


def run(verbose=True):
    lm = LayerMapping(bikes, bikes_shp, bikes_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
