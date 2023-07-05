"""Soundline URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from .settings import MEDIA_URL, MEDIA_ROOT
from Main_pages.views import*
from User_pages.views import*

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', show_main, name="main"),
    path('music-overview/<music_pk>', show_music_overview, name="music-overvie"),
    path('favorite/', favorite, name='favorite'),
    path('playlist/', playlist, name='playlist'),
    path('form_buy/', form_buy, name='form_buy'),
    path('profile/', profile, name='profile'),
    path('registration/', register, name='registration'),
    path('login/', auth, name='auth'),
    path('upload/', upload, name='upload'),
    path('clips/<str:pk>', StaticAudioView),
    path('search_url/', search, name='search'),
    path('settings/', show_settings, name='settings'),
    path('save-data-of-music', saveDataOfCurrentSong, name='save_data_of_music'),
    path('next_music', next_music, name='next_music')
] + static(MEDIA_URL, document_root = MEDIA_ROOT)
