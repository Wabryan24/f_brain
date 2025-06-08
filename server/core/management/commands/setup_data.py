from django.core.management.base import BaseCommand
from core.models import Professor

class Command(BaseCommand):
    help = 'Crée des données de test pour les professeurs'

    def handle(self, *args, **options):
        professors_data = [
            {
                'name': 'Dr. Marie Dupont',
                'subject': 'Mathématiques',
                'description': 'Professeure de mathématiques avancées, spécialisée en algèbre linéaire et analyse.'
            },
            {
                'name': 'Prof. Jean Martin',
                'subject': 'Informatique',
                'description': 'Expert en programmation Python et développement web. Très pédagogue.'
            },
            {
                'name': 'Dr. Sophie Bernard',
                'subject': 'Physique',
                'description': 'Docteure en physique quantique, excellente pour expliquer les concepts complexes.'
            },
            {
                'name': 'Prof. Antoine Rousseau',
                'subject': 'Histoire',
                'description': 'Historien passionné, spécialisé dans l\'histoire contemporaine européenne.'
            },
            {
                'name': 'Dr. Camille Moreau',
                'subject': 'Chimie',
                'description': 'Professeure de chimie organique, très appréciée pour ses TP pratiques.'
            }
        ]

        created_count = 0
        for prof_data in professors_data:
            professor, created = Professor.objects.get_or_create(
                name=prof_data['name'],
                defaults=prof_data
            )
            if created:
                created_count += 1
                self.stdout.write(f"✅ Professeur créé: {professor.name}")
            else:
                self.stdout.write(f"⚠️  Professeur existe déjà: {professor.name}")

        self.stdout.write(
            self.style.SUCCESS(f'Terminé! {created_count} nouveaux professeurs créés.')
        )