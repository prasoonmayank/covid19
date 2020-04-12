from rest_framework import serializers
from api.models import AppUser, Location

class AppUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppUser
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    white = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ('latitude', 'longitude', 'red', 'yellow', 'green', 'white')

    def get_white(self):
        total_count = self.red.count() + self.yellow.count() + self.green.count()
        return total_count == 0
