from django.urls import re_path
from .consumers import SimpleConsumer, GameConsumer, ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/simple/$', SimpleConsumer.as_asgi()),
    re_path(r'ws/game/$', GameConsumer.as_asgi()), 
    re_path(r'ws/chat/$', ChatConsumer.as_asgi())
]