from django.urls import path
from .views import CreateUserView, LoginView, LogoutView, IsAuthenticatedView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('log_out/', LogoutView.as_view()), 
    path('login/', LoginView.as_view()),
    path('register/', CreateUserView.as_view()),
    path('is_auth/', IsAuthenticatedView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify')
]