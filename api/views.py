from rest_framework import viewsets
from api.models import AppUser, Location
from api.serializers import AppUserSerializer, LocationSerializer

class AppUserViewset(viewsets.ModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class LocationViewset(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
