from django.urls import path
from .views import SimpleConsumer
websocket_urlpatterns = [
    path('simple/', SimpleConsumer.as_asgi()),
]
