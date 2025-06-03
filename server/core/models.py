# Create your models here.
from django.db import models

class Professor(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class Vote(models.Model):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True, null=True)
