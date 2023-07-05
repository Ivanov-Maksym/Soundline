from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from .models import MyUser, FavoriteMusic, PlayLists
from Main_pages.models import Sound, Category

# Create your views here.
def next_music(request):

    if request.user.pk != None and request.user.pk != 1:
        current_pk = request.GET['current_pk']
        current_sound = Sound.objects.get(pk=current_pk)

        if request.GET['target'] == 'playlist':

            current_playlist = PlayLists.objects.get(pk=request.GET['playlist_pk'])

            sounds = list(current_playlist.sounds.all())

            index = sounds.index(current_sound)

            if not index + 1 == len(sounds):
                if request.GET['action'] == 'next':
                    next_sound = sounds[index + 1]
                    return HttpResponse(f'{next_sound.pk},{current_playlist.pk}')
            if request.GET['action'] == 'prev':
                next_sound = sounds[index - 1]
                return HttpResponse(f'{next_sound.pk},{current_playlist.pk}')
            else:
                return HttpResponse('false')
        elif request.GET['target'] == 'favorite':
            favorite = FavoriteMusic.objects.get(user=request.user)
            sounds = list(favorite.sounds.all())

            index = sounds.index(current_sound)

            if not index + 1 == len(sounds):
                if request.GET['action'] == 'next':
                    next_sound = sounds[index + 1]
                    return HttpResponse(f'{next_sound.pk},fav')
            if request.GET['action'] == 'prev':
                next_sound = sounds[index - 1]
                return HttpResponse(f'{next_sound.pk},fav')
            else:
                return HttpResponse('false')

def base(request):

    return render(request, 'User_pages/base.html', context={'title': 'Base'})

def profile(request):
    user = request.user

    list_of_music = []

    context = {}

    if user.id == None or user.id == 1:
        return redirect('auth')
    else:
        my_user = MyUser.objects.get(user=user)

        list_of_music = list(my_user.sounds.all())

        context = {
            'title': 'Profile',
            'username': user.username,
            'picture': my_user.img,
            'bio': my_user.bio,
            'my_sound': list_of_music
        }
        
        if request.method == 'POST':
            sound_pk = request.POST.get("q")
            if sound_pk != None:
                music = Sound.objects.get(pk=sound_pk)
                music.delete()
                return redirect(request.path)

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']
    
    return render(request, 'User_pages/profile.html', context)

def favorite(request):

    if request.user.pk == None or request.user.pk == 1:
        return redirect('auth')

    list_of_music = []
    context = {}

    if FavoriteMusic.objects.filter(user=request.user).exists():

        user_favorite = FavoriteMusic.objects.get(user=request.user)

        list_of_music = user_favorite.sounds.all()

        context = {
            'title': 'Favorite',
            'list_of_music': list_of_music,
            'can_click': True
        }

    if 'music_pk' in request.POST:
        user_favorite = FavoriteMusic.objects.get(user=request.user)
        sound_to_delete = Sound.objects.get(pk=request.POST['music_pk'])

        if user_favorite.sounds.contains(sound_to_delete):
            user_favorite.sounds.remove(sound_to_delete)
        else:
            user_favorite.sounds.add(sound_to_delete)

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'User_pages/favorite.html', context=context)

def register(request):
    context = {}
    create_user = True
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        repeat_password = request.POST.get('repeat_password')
        email = request.POST.get('email')
        
        context['username'] = username
        context['password'] = password
        context['repeat_password'] = repeat_password
        context['email'] = email
        
        if password != repeat_password:
            context["error_text"] = "Wrong password"
            create_user = False
        if len(password) < 8:
            context["error_text"] = "Password must contain 8 or more characters"
            create_user = False
        if username == '' or email == '':
            context["error_text"] = "Fill all fields"
            create_user = False
        if create_user:
            try:
                User.objects.create_user(username=username, email=email, password=password)
                user = authenticate(request, username=username, password=password)

                user_example = User.objects.get(pk=user.id)

                my_user = MyUser.objects.create(user=user_example)
                my_user.save()

                login(request, user)
                return redirect("profile")
            except IntegrityError:
                context['error_text'] = 'Such user already exists'
            
    return render(request, 'User_pages/register.html', context)

def auth(request):
    context = {}

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request ,username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("profile")
        else:
            context['error_text'] = 'User does not exist'
        
    return render(request, 'User_pages/auth.html', context)

def upload(request):
    categories = Category.objects.all()

    context = {
        "title": "Upload",
        "categories": categories
    }
    create_music = True
    if request.method == 'POST':
        file = ''
        image = ''
        if request.FILES:
            file = request.FILES['file']
            image = request.FILES['image']
        title = request.POST.get('title')
        music_lyrics = request.POST.get('music_lyrics')
        price = request.POST.get('price')
        category = request.POST.get('category')
        
        context['file'] = file
        context['image'] = image
        context['title'] = title
        context['music_lyrics'] = music_lyrics
        context['price'] = price

        author = User.objects.get(pk = request.user.id)
        selected_category = Category.objects.get(pk=category)

        my_user = MyUser.objects.get(user=author)

        if file == '':
            context["error_text"] = "Add music"
            create_music = False
        if image == '':
            context['error_text'] = 'Add image'
            create_music = False
        if title == '':
            context['error_text'] = 'Add title'
            create_music = False
        if price == '':
            context['error_text'] = 'Add price'
            create_music = False
        if category == '':
            context['error_text'] = 'Add category'
            create_music = False
        if create_music:
            try:
                sound = Sound.objects.create(file = file, name = title, music_lyrics=music_lyrics, image=image, price=price, author=author.username, category=selected_category)
                sound.save()
                my_user.sounds.add(sound)
                my_user.save()
                return redirect("profile")
            except IntegrityError:
                context['error_text'] = ''

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'User_pages/upload_music.html', context)

def search(request):

    search_request = request.GET.get('q')

    response_list = []
    
    response = list(Sound.objects.filter(name__icontains=search_request))
    response_list += response
    if len(response) <= 3:
        response_list += list(Sound.objects.filter(author__icontains=search_request))

    results_amount = len(response_list)

    context = {
        'search_response': response_list,
        'results_amount': results_amount
    }

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'User_pages/search.html', context)

def show_settings(request):
    user = request.user.id

    my_user = MyUser.objects.get(user=user)

    context = {
        "title": "Settings"
    }

    if request.method == 'POST':
        image = ''
        name = request.POST.get('name')
        bio = request.POST.get('bio')
        if request.FILES:
            image = request.FILES['image']
            
        context['name'] = name
        context['image'] = image
        context['bio'] = bio
        if name !='':
            if my_user.user.username != name:
                my_user.user.username = name
                my_user.user.save()
        if my_user.bio == '' or my_user.bio != bio:
            my_user.bio = bio
            my_user.save()
        if image != '':
            my_user.img = image
            my_user.save()
        return redirect('profile')
    
    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'User_pages/settings.html', context)

def playlist(request):

    context = {
        'logined': ''
    }

    if request.user.pk != None and request.user.pk != 1:
        user = request.user
        playlist_list =[]
        my_playlists = PlayLists.objects.filter(user=user)

        for playlist in my_playlists:
            playlist_list.append(playlist.sounds)

        context = {
            'title':'Playlist',
            'playlists':my_playlists,
            'playlist_list': playlist_list,
            'playlists_len': len(playlist_list),
            'can_click': True
        }

    if 'name' in request.session:
        context['name'] = request.session['name']
        context['author'] = request.session['author']
        context['image'] = request.session['image']
        context['file'] = request.session['file']
        context['currentTime'] = request.session['currentTime']
        context['volume'] = request.session['volume']

    return render(request, 'User_pages/playlist.html', context)