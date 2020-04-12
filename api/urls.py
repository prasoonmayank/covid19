from rest_framework.routers import DefaultRouter
from api.views import AppUserViewset, LocationViewset

api_router = DefaultRouter()
api_router.register(r'app_users', AppUserViewset)
api_router.register(r'location', LocationViewset)
