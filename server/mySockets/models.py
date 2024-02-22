from django.db import models
from django.contrib.auth.models import User
class Game(models.Model):
  code = models.CharField(max_length=10, unique=True)
  created_by = models.ForeignKey(User, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)