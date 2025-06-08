from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import Professor, Vote
from .serializers import (
    ProfessorSerializer, 
    ProfessorDetailSerializer,
    ProfessorStatsSerializer,
    VoteSerializer, 
    VoteCreateSerializer
)


class ProfessorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour les professeurs - lecture seule
    """
    queryset = Professor.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProfessorDetailSerializer
        elif self.action == 'stats':
            return ProfessorStatsSerializer
        return ProfessorSerializer
    
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """
        Endpoint pour le dashboard: /api/professors/stats/
        Retourne les statistiques globales
        """
        professors = Professor.objects.all()
        serializer = ProfessorStatsSerializer(professors, many=True)
        
        # Calcul des stats globales
        total_votes = Vote.objects.count()
        total_professors = professors.count()
        
        return Response({
            'professors': serializer.data,
            'global_stats': {
                'total_votes': total_votes,
                'total_professors': total_professors,
                'average_votes_per_professor': round(total_votes / total_professors, 1) if total_professors > 0 else 0
            }
        })


class VoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les votes
    """
    queryset = Vote.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return VoteCreateSerializer
        return VoteSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Créer un nouveau vote avec gestion d'erreurs
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Vote enregistré avec succès!'},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )