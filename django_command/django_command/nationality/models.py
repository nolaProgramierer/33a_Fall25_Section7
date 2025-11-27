from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

    def __str__(self):
        return self.username


class Nationality(models.Model):
    country_id = models.CharField(max_length=24)
    probability = models.DecimalField(max_digits=5, decimal_places=3)

    def __str__(self):
        return f"Country id: {self.country_id}, Probability: {self.probability}"

