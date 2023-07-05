from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name

class Sound(models.Model):
    file = models.FileField(upload_to='audio/', null=True)
    name = models.CharField(max_length=30, null=True)
    author = models.CharField(max_length=30, null=True)
    image = models.ImageField(upload_to='media/', null=True)
    music_lyrics = models.TextField(null=True)
    price = models.IntegerField(null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    
    def get_absolute_url(self):
        return reverse('music-overvie', kwargs={'music_pk': self.pk})

    def __str__(self):
        return self.name