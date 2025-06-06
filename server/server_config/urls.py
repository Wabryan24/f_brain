from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


def home(request):
    return HttpResponse("Bienvenue sur la page d'accueil de l'API des votes de professeurs.")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # Toutes les routes API (professors, votes, etc.)
    path('', home),  # Page d'accueil
]
