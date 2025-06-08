from rest_framework import serializers
from .models import Professor, Vote, Comment

class VoteSerializer(serializers.ModelSerializer):
    """Serializer pour les votes (lecture)"""
    timestamp = serializers.DateTimeField(format="%d/%m/%Y %H:%M", read_only=True)
    score_display = serializers.CharField(source='get_score_display', read_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'score', 'score_display', 'comment', 'timestamp']


class VoteCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un vote"""
    
    class Meta:
        model = Vote
        fields = ['professor', 'score', 'comment']
    
    def create(self, validated_data):
        # Récupérer l'IP depuis le contexte
        request = self.context.get('request')
        ip_address = self.get_client_ip(request)
        
        return Vote.objects.create(
            ip_address=ip_address,
            **validated_data
        )
    
    def get_client_ip(self, request):
        """Récupère l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
def validate(self, data):
    """Validation : vérifier si l'IP a déjà voté + commentaire correct"""
    request = self.context.get('request')
    ip_address = self.get_client_ip(request)
    professor = data.get('professor')

    # Validation IP
    if Vote.objects.filter(professor=professor, ip_address=ip_address).exists():
        raise serializers.ValidationError(
            "Vous avez déjà voté pour ce professeur."
        )

    # Validation commentaire (pas juste des espaces)
    comment = data.get('comment')
    if comment and not comment.strip():
        raise serializers.ValidationError(
            "Le commentaire ne peut pas être vide ou composé uniquement d'espaces."
        )

    return data

class ProfessorSerializer(serializers.ModelSerializer):
    """Serializer pour les professeurs (liste)"""
    nombre_votes = serializers.SerializerMethodField()
    moyenne_notes = serializers.SerializerMethodField()
    
    class Meta:
        model = Professor
        fields = [
            'id', 'name', 'subject', 'description', 'photo',
            'nombre_votes', 'moyenne_notes'
        ]

    def get_nombre_votes(self, obj):
        return obj.total_votes

    def get_moyenne_notes(self, obj):
        return obj.average_score if obj.average_score > 0 else None


class ProfessorDetailSerializer(ProfessorSerializer):
    """Serializer détaillé pour un professeur"""
    votes = VoteSerializer(many=True, read_only=True)
    score_distribution = serializers.SerializerMethodField()
    
    class Meta(ProfessorSerializer.Meta):
        fields = ProfessorSerializer.Meta.fields + ['votes', 'score_distribution']
    
    def get_score_distribution(self, obj):
        """Distribution des scores pour les graphiques"""
        return obj.score_distribution


class ProfessorStatsSerializer(serializers.ModelSerializer):
    """Serializer pour les statistiques globales"""
    nombre_votes = serializers.SerializerMethodField()
    moyenne_notes = serializers.SerializerMethodField()
    pourcentage_votes = serializers.SerializerMethodField()
    
    class Meta:
        model = Professor
        fields = ['id', 'name', 'subject', 'nombre_votes', 'moyenne_notes', 'pourcentage_votes']
    
    def get_nombre_votes(self, obj):
        return obj.total_votes
    
    def get_moyenne_notes(self, obj):
        return obj.average_score
    
    def get_pourcentage_votes(self, obj):
        """Calcul du pourcentage par rapport au total"""
        total_votes = sum(prof.total_votes for prof in Professor.objects.all())
        if total_votes == 0:
            return 0
        return round((obj.total_votes / total_votes) * 100, 1)