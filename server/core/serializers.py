# core/serializers.py

from rest_framework import serializers
from .models import Professor, Vote

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'

class ProfessorSerializer(serializers.ModelSerializer):
    nombre_votes = serializers.SerializerMethodField()
    moyenne_notes = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        fields = ['id', 'name', 'description', 'nombre_votes', 'moyenne_notes']

    def get_nombre_votes(self, obj):
        return obj.votes.count()

    def get_moyenne_notes(self, obj):
        votes = obj.votes.all()
        if votes.exists():
            total = sum(v.score for v in votes)
            return round(total / votes.count(), 2)
        return None
