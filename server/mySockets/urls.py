from django.urls import re_path
from .consumers import SimpleConsumer

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<room_code>\d+)/$', SimpleConsumer.as_asgi()), 
]