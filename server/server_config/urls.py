from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django_prometheus import exports


def home(request):
    return HttpResponse("Bienvenue sur la page d'accueil de l'API des votes de professeurs.")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # Toutes les routes API (professors, votes, etc.)
    path('home/', home),  # Page d'accueil
    path("metrics/", exports.ExportToDjangoView, name="prometheus-django-metrics"),
]