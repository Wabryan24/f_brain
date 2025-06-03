from rest_framework import viewsets
from .models import Professor, Vote
from .serializers import ProfessorSerializer, VoteSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
from django.shortcuts import render

# Create your views here.
