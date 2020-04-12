from django.db import models
from django.contrib.auth.models import User

class AppUser(User):
    latitude = models.CharField(max_length=16)
    longitude = models.CharField(max_length=16)

class Location(models.Model):
    latitude = models.CharField(max_length=16)
    longitude = models.CharField(max_length=16)
    red = models.ManyToManyField(AppUser, related_name="red_users")
    yellow = models.ManyToManyField(AppUser, related_name="yellow_users")
    green = models.ManyToManyField(AppUser, related_name="green_users")
