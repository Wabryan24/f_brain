from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Professor, Vote
from .serializers import ProfessorSerializer, VoteSerializer


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    @action(detail=False, methods=["get"], url_path="vote-results")
    def vote_results(self, request):
        """
        Custom endpoint: /api/professors/vote-results/
        Returns the number of votes per professor.
        """
        results = (
            Vote.objects.values("professor__name")
            .annotate(vote_count=Count("id"))
            .order_by("-vote_count")
        )
        return Response(results)


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
