from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User 
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
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
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_authenticated:  
            data = {
                'isAuthenticated': True,
                'username': request.user.username
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
