from django.urls import re_path
from .views import SimpleConsumer, GameConsumer
websocket_urlpatterns = [
    re_path(r'ws/simple/$', SimpleConsumer.as_asgi()),
    re_path(r'ws/game/$', GameConsumer.as_asgi()), 

]