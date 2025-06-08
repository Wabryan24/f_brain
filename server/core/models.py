from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

# Liste des choix de score de 1 à 5 étoiles
SCORE_CHOICES = [(i, '⭐' * i) for i in range(1, 6)]

class Professor(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom du professeur")
    subject = models.CharField(max_length=100, verbose_name="Matière", default="Non spécifiée")
    description = models.TextField(verbose_name="Description")
    photo = models.URLField(blank=True, null=True, verbose_name="Photo URL")
    created_at = models.DateTimeField(auto_now_add=True)  # Modification ici (retrait du default=timezone.now)
    
    class Meta:
        verbose_name = "Professeur"
        verbose_name_plural = "Professeurs"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
    
    @property
    def total_votes(self):
        """Nombre total de votes pour ce professeur"""
        return self.votes.count()
    
    @property
    def average_score(self):
        """Score moyen pour ce professeur"""
        votes = self.votes.all()
        if votes:
            return round(sum(vote.score for vote in votes) / len(votes), 1)
        return 0
    
    @property
    def score_distribution(self):
        """Distribution des scores (pour les graphiques)"""
        distribution = {i: 0 for i in range(1, 6)}
        for vote in self.votes.all():
            distribution[vote.score] += 1
        return distribution


class Vote(models.Model):
    professor = models.ForeignKey(
        Professor, 
        on_delete=models.CASCADE, 
        related_name='votes',
        verbose_name="Professeur"
    )
    ip_address = models.GenericIPAddressField(verbose_name="Adresse IP")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Date du vote")
    comment = models.TextField(
        blank=True, 
        null=True, 
        max_length=500,
        verbose_name="Commentaire"
    )
    score = models.IntegerField(
        choices=SCORE_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Score"
    )
    
    class Meta:
        verbose_name = "Vote"
        verbose_name_plural = "Votes"
        ordering = ['-timestamp']
        # Contrainte : une seule IP par professeur
        unique_together = [['professor', 'ip_address']]
    
    def __str__(self):
        return f"{self.professor.name} - {self.score}⭐"
    
    def clean(self):
        """Validation personnalisée"""
        if self.score < 1 or self.score > 5:
            raise ValidationError("Le score doit être entre 1 et 5")


class Comment(models.Model):
    """Modèle pour les commentaires séparés (optionnel)"""
    vote = models.OneToOneField(
        Vote, 
        on_delete=models.CASCADE, 
        related_name='detailed_comment'
    )
    content = models.TextField(max_length=1000, verbose_name="Commentaire détaillé")
    is_anonymous = models.BooleanField(default=True, verbose_name="Anonyme")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Commentaire détaillé"
        verbose_name_plural = "Commentaires détaillés"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Commentaire pour {self.vote.professor.name}"