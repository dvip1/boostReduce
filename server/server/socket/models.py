from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Game(models.Model):
  code = models.CharField(max_length=10, unique=True)
  created_by = models.ForeignKey(User, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)