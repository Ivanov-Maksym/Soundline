from django.db import models
from django.contrib.auth.models import User
from Main_pages.models import Sound
from django.urls import reverse

class MyUser(models.Model):
    img = models.ImageField(upload_to='media', default='unknown.jpg')
    sounds = models.ManyToManyField(Sound)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=255, null=True)

class AllowList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sound = models.ManyToManyField(Sound)

class FavoriteMusic(models.Model):
    sounds = models.ManyToManyField(Sound)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class PlayLists(models.Model):
    sounds = models.ManyToManyField(Sound)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)