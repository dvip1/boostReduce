from django.urls import re_path
from .views import SimpleConsumer

websocket_urlpatterns = [
    re_path(r'ws/simple/$', SimpleConsumer.as_asgi()),
]