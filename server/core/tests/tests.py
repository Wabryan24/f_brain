from django.test import TestCase
import pytest
from core.models import Professeur

@pytest.mark.django_db
def test_create_professeur():
    prof = Professeur.objects.create(nom="Test Prof")
    assert prof.nom == "Test Prof"
