from django.shortcuts import render, redirect
from .models import Sound, Category
from User_pages.models import FavoriteMusic, PlayLists, AllowList
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import FileResponse, HttpResponse
from Soundline.settings import TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_CHAT_ID
from .telegram import send_message_to_telegram
from User_pages.models import MyUser
from django.db.utils import IntegrityError
import os
import Soundline.settings as settings




class CategoryExample():
    def __init__(self, name, list_of_musics):
        self.name = name
        self.list_of_musics = list_of_musics

class PlaylistExample():
    def __init__(self, playlist, checked):
        self.playlist = playlist
        self.checked = checked

def saveDataOfCurrentSong(requset):
    if 'name' in requset.GET:
        requset.session['name'] = requset.GET['name']
        requset.session['author'] = requset.GET['author']
        requset.session['image'] = requset.GET['image']
        requset.session['file'] = requset.GET['file']
        requset.session['currentTime'] = requset.GET['currentTime']
        requset.session['volume'] = requset.GET['volume']

    return HttpResponse()

def show_main(request):

    categories = Category.objects.all()
    list_of_musics = []

    for category in categories:
        list_of_musics.append(CategoryExample(category.name, Sound.objects.filter(category=category.pk)))

    context={
        "title":'Main',
        'list_of_musics': list_of_musics
    }

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'Main_pages/main.html', context)

def show_music_overview(request, music_pk):
    music = get_object_or_404(Sound, pk=music_pk)

    context ={
        "title":'Music Overview',
        "music": music,
        'color': '',
        'disabled': ''
    }

    list_of_playlists = []

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    if request.user.pk == None or request.user.pk == 1:
        context['disabled'] = 'disabled'

    if request.user.pk != None and request.user.pk != 1:
        user = request.user
        user_playlist = PlayLists.objects.filter(user=user)
        for playlist in user_playlist:
            if playlist.sounds.contains(music):
                list_of_playlists.append(PlaylistExample(playlist,'checked'))
            else:
                list_of_playlists.append(PlaylistExample(playlist,''))

        context['playlists'] = list_of_playlists

    if request.user.pk != None and request.user.pk != 1:
        if (FavoriteMusic.objects.filter(user=request.user).exists()):
            favorite_music = FavoriteMusic.objects.get(user=request.user)
            if favorite_music.sounds.contains(music):
                context['color'] = '#FF9898'

    if 'music_pk' in request.POST:
        if request.user.pk != None and request.user.pk != 1:

            user = request.user

            sound_pk = request.POST['music_pk']

            sound_to_favorite = Sound.objects.get(pk=sound_pk)

            if (FavoriteMusic.objects.filter(user=user).exists()):
                favorite_music = FavoriteMusic.objects.get(user=user)
                if favorite_music.sounds.contains(sound_to_favorite):
                    favorite_music.sounds.remove(sound_to_favorite)
                else:
                    favorite_music.sounds.add(sound_to_favorite)
            else:
                favorite_music = FavoriteMusic.objects.create(user=user)
                favorite_music.sounds.add(sound_to_favorite)

            favorite_music.save()
        
    if 'playlist_pk' in request.POST:
        playlist = PlayLists.objects.get(pk=request.POST['playlist_pk'])

        if playlist.sounds.contains(music):
            playlist.sounds.remove(music)
        else:
            playlist.sounds.add(music)

    if request.user.pk != None and request.user.pk != 1:
        if 'newPlaylistName' in request.POST:
            new_playlist_name = request.POST['newPlaylistName']

            if not PlayLists.objects.filter(name=new_playlist_name).exists():
                new_playlist = PlayLists.objects.create(user=request.user,name=new_playlist_name)
                new_playlist.sounds.add(music)
                new_playlist.save()

    if 'del_playlist_pk' in request.POST:
        del_playlist_pk = request.POST['del_playlist_pk']
        playlist_to_delete = PlayLists.objects.get(pk=del_playlist_pk)
        
        playlist_to_delete.delete()

    if request.user.pk != None and request.user.pk != 1:
        if (AllowList.objects.filter(user=request.user).exists()):
            allow_list = AllowList.objects.get(user=request.user)
            if allow_list.sound.contains(music):
                button_blocked = True
                context['button_blocked'] = button_blocked
    
    return render(request, 'Main_pages/music_overview.html', context)

def form_buy(request):

    context ={
        "title":"Form for buy lisence"
    }
    if request.user.pk != None and request.user.pk != 1:
        user = request.user

        buy =True

        sound_pk = request.GET.get("q")
        music = Sound.objects.get(pk=sound_pk)
        context['music'] = music
        my_user = MyUser.objects.get(user=user)

        if request.method == 'POST':
            number_of_card = request.POST.get("number_of_card")

            if len(number_of_card) < 16:
                context['error_text'] = 'incorrect card number'
                buy = False
            if buy:
                try:
                    message = f"{my_user.user.username}, right now buying '{music.name}' at a price of {music.price}$"
                    send_message_to_telegram(TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_CHAT_ID, message)

                    if (AllowList.objects.filter(user=user).exists()):
                        allow_list = AllowList.objects.get(user=user)
                        allow_list.sound.add(music)
                    else:
                        allow_list = AllowList.objects.create(user=user)
                        allow_list.sound.add(music)

                    allow_list.save()
                    return redirect(music.get_absolute_url())

                except IntegrityError:
                    context['error_text'] = '12345'
    else:
        return redirect('auth')

    return render(request,'Main_pages/form_buy.html', context)

@csrf_exempt
def StaticAudioView(request, pk):
  filename = Sound.objects.get(pk=pk).file.name
  response = FileResponse(open(os.path.join(settings.MEDIA_ROOT, filename), "rb"))
  return response