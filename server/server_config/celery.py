import os
from celery import Celery

# Met à jour le nom du module settings avec celui de ton projet Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server_config.settings')

app = Celery('server_config')

# Charge les paramètres CELERY_ depuis le fichier Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Recherche automatiquement les tasks dans les fichiers tasks.py des apps installées
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
