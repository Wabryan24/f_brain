from django.db import models

# Liste des choix de score de 1 à 5 étoiles
SCORE_CHOICES = [(i, '⭐' * i) for i in range(1, 6)]

class Professor(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Vote(models.Model):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='votes')
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True, null=True)
    score = models.IntegerField(choices=SCORE_CHOICES)

    def __str__(self):
        return f"{self.professor.name} - {self.score}⭐"
