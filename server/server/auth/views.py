from django.contrib.auth.models import User 
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings  
import django

class CreateUserView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password)
            return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
        except django.db.IntegrityError:  # Catch existing username scenario
            return Response({'error': 'Username already exists'}, status=status.HTTP_409_CONFLICT)
        except ValidationError as e:  # Catch potential password validation errors
             return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST) 


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)  # Generate JWT tokens
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except KeyError:  # In case 'refresh' key is missing in request data
            return Response({'error': 'Refresh token is missing'}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            'isAuthenticated': True,
            'username': request.user.username
        }
        return Response(data, status=status.HTTP_200_OK)