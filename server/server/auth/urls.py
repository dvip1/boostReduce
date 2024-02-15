from django.urls import path
from .views import CreateUserView, LoginView, LogoutView, IsAuthenticatedView

urlpatterns = [
    path('log_out/', LogoutView.as_view()),  # Removed the space
    path('login/', LoginView.as_view()),
    path('register/', CreateUserView.as_view()),
    path('is_auth/', IsAuthenticatedView.as_view())
]