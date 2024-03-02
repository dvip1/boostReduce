from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs 
User = get_user_model()

@database_sync_to_async
def get_user(jwt):
    try:
        UntypedToken(jwt)
    except (InvalidToken, TokenError) as e:
        print(f"Invalid token: {e}")
        return AnonymousUser()
    else:
        decoded_data = jwt_decode(jwt, settings.SECRET_KEY, algorithms=["HS256"])
        user = User.objects.get(id=decoded_data["user_id"])
        return user

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try: 
            query_params = parse_qs(scope['query_string'].decode())
            token = query_params.get('token', [None])[0]
            if token:
                scope['user'] = await get_user(token)
                print(f"Checking in middleware: {scope['user']}")
            else:
                scope['user'] = AnonymousUser()
        except Exception as e: 
            print(f"Error in JWTAuthMiddleware: {e}")
            scope['user']= AnonymousUser()
        return await super().__call__(scope, receive, send)          