from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user(jwt):
    try:
        UntypedToken(jwt)
    except (InvalidToken, TokenError) as e:
        return AnonymousUser()
    else:
        decoded_data = jwt_decode(jwt, settings.SECRET_KEY, algorithms=["HS256"])
        return User.objects.get(id=decoded_data["user_id"])

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b'cookie' in headers:
            cookies = headers[b'cookie'].decode()
            jwt = cookies.split('JWT ')[-1].split(';')[0]
            scope['user'] = await get_user(jwt)
        return await super().__call__(scope, receive, send)