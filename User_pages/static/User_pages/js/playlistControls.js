const playButton = document.querySelectorAll('.music__play');
const controls = document.querySelector('.controls');

const controlsTitle = document.querySelector('.controls__title'),
	controlsAuthor = document.querySelector('.controls__author'),
	controlsPlay = document.querySelector('.controls__play'),
	progressContainer = document.querySelector('.controls__progress-container'),
	progress = document.querySelector('.controls__progress'),
	nextSong = document.querySelector('.controls__next-song'),
	prevSong = document.querySelector('.controls__prev-song'),
	volumeIcon = document.querySelector('.volume__icon'),
	volumeProgressContainer = document.querySelector('.volume__progress-container'),
	volumeProgress = document.querySelector('.volume__progress'),
	controlsImage = document.querySelector('.controls__picture'),
	loopButton = document.querySelector('.controls__loop'),
	timerMinutes = document.querySelector('.minutes'),
	timerSeconds = document.querySelector('.seconds');

	const savedDataAudio = controlsPlay.dataset
	const allAudio = document.querySelectorAll('._audio')

let currentSong = ''
let currentPlayButton = ''
let volume = 1

if (controlsPlay.getAttribute("data-volume")) {
	if (allAudio.length > 1) {
		allAudio.forEach(element => {
			if (element.children[0].src == savedDataAudio.audiourl) {
				currentSong = element
			}
		});
	} else {
		currentSong = allAudio[0]
	}
	let parent = currentSong.closest('.music');
	currentPlayButton = parent.querySelector('.save-button');
	currentPlayButton.classList.add('playing');

	volume = savedDataAudio.volume
	currentSong.volume = volume
	volumeProgress.style.width = `${volume * 100}%`

	currentSong.addEventListener('timeupdate', updateProgress);
	currentSong.addEventListener('ended', function (e) {
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')
		controlsPlay.classList.add('_icon-play')
		controlsPlay.classList.remove('_icon-pause')
	});
	progressContainer.addEventListener('click', setProgress);
	volumeProgressContainer.addEventListener('click', setVolume);
	currentSong.currentTime = savedDataAudio.currenttime;
	setInterval(updateTimer, 1000)
}

playButton.forEach(element => {
	element.addEventListener('click', initPlayAndPause);
});

function initPlayAndPause(e) {
	if (e.target) {
		currentPlayButton = e.target
	} else {
		currentPlayButton = e
	}

	if (document.querySelector('.playing') != null & currentPlayButton != document.querySelector('.playing')) {
		let playingMusic = document.querySelector('.playing')
		playingMusic.nextElementSibling.pause()
		playingMusic.nextElementSibling.currentTime = 0
		playingMusic.classList.remove('playing')
		playingMusic.classList.remove('_icon-pause')
		playingMusic.classList.add('_icon-play')

		controlsPlay.classList.remove('_icon-play')
		controlsPlay.classList.add('_icon-pause')

		volumeIcon.classList.remove('disable')

		if (currentSong) {
			currentSong.loop = false
			loopButton.style.color = '#fff'
		}
	}

	document.body.classList.add('ctrl-active')
	currentMusicContainer = currentPlayButton.closest('.main__music')
	currentSong = currentPlayButton.nextElementSibling
	setInterval(updateTimer, 1000)
	currentSong.volume = volume
	currentSong.addEventListener('ended', function (e) {
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')
		controlsPlay.classList.add('_icon-play')
		controlsPlay.classList.remove('_icon-pause')
	});

	// event listeners
	currentSong.addEventListener('timeupdate', updateProgress)
	progressContainer.addEventListener('click', setProgress)
	volumeProgressContainer.addEventListener('click', setVolume)

	if (currentPlayButton.classList.contains('_icon-play')) {
		controlsTitle.textContent = currentMusicContainer.querySelector('.music__title').textContent.slice(0,10) + '...'
		controlsAuthor.textContent = currentMusicContainer.querySelector('.music__author').textContent.slice(0,10) + '...'

		currentSong.play()
		currentPlayButton.classList.remove('_icon-play')
		currentPlayButton.classList.add('_icon-pause')
		currentPlayButton.classList.add('playing')

		controlsPlay.classList.remove('_icon-play')
		controlsPlay.classList.add('_icon-pause')

		volumeProgress.style.width = `${currentSong.volume * 100}%`

		controlsImage.src = currentMusicContainer.querySelector('.music__image').children[0].src
	} else {
		currentSong.pause()
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')
		currentPlayButton.classList.remove('playing')

		controlsPlay.classList.add('_icon-play')
		controlsPlay.classList.remove('_icon-pause')
	}
}

// event listeners
controlsPlay.addEventListener('click', playAndPauseMusic)

loopButton.addEventListener('click', loopMusic)

volumeIcon.addEventListener('click', function (e) {
	if (volumeIcon.classList.contains('disable')) {
		currentSong.volume = volume
		volumeIcon.classList.remove('disable')
	} else {
		volume = currentSong.volume
		currentSong.volume = 0
		volumeIcon.classList.add('disable')
	}
});

// Controls play an pause -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function playAndPauseMusic(e) {
	if (e.target.classList.contains('_icon-play')) {
		currentSong.play()
		e.target.classList.remove('_icon-play')
		e.target.classList.add('_icon-pause')
		currentPlayButton.classList.remove('_icon-play')
		currentPlayButton.classList.add('_icon-pause')
	} else {
		currentSong.pause()
		e.target.classList.add('_icon-play')
		e.target.classList.remove('_icon-pause')
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')
	}
}

// Progress bar -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function updateProgress(event) {
	const { duration, currentTime } = event.srcElement
	const progressPercents = (currentTime / duration) * 100

	progress.style.width = `${progressPercents}%`
}

function updateTimer() {
	let time = Number(currentSong.currentTime.toFixed(0));

	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	timerMinutes.textContent = `0${minutes}`;

	if (seconds > 9) {
		timerSeconds.textContent = seconds
	} else {
		timerSeconds.textContent = `0${seconds}`
	}
}

function setProgress(event) {
	const width = progressContainer.clientWidth
	const clickPoint = event.offsetX
	const duration = currentSong.duration

	currentSong.currentTime = (clickPoint / width) * duration
}

function setVolume(event) {
	const width = volumeProgressContainer.clientWidth
	const clickPoint = event.offsetX
	volumeIcon.classList.remove('disable')

	volume = clickPoint / width
	currentSong.volume = volume
	volumeProgress.style.width = `${(clickPoint / width) * 100}%`
}

// Loop button -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function loopMusic(event) {
	if (currentSong.loop == false) {
		loopButton.style.color = '#4294FF'
		currentSong.loop = true
	} else {
		loopButton.style.color = '#fff'
		currentSong.loop = false
	}
}

$(document).ready(function() {
	allAudio.forEach(element => {
		element.addEventListener('ended', function(e) {
			let target = ''
			if (element.dataset.playlistpk) {
				target = 'playlist'
			} else {
				target = 'favorite'
			}
			$.ajax({
				type:"get",
				url: requestUrl.value,
				data: {
					'current_pk': element.dataset.pk,
					'playlist_pk': element.dataset.playlistpk,
					'action': 'next',
					'target': target
				},
				success: function(response) {
					if (response != 'false') {
						let responseData = response.split(",")
						if (responseData[1] != 'fav') {
							let parent = document.querySelectorAll(`[data-playlistpk~="${responseData[1]}"]`)[0].closest('.playlist_box');

							let nextMusic = parent.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
							let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
							
							currentSong = nextMusic
							initPlayAndPause(buttonCurrent)
						} else {
							let nextMusic = document.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
							let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
							
							currentSong = nextMusic
							initPlayAndPause(buttonCurrent)
						}
					}
				}
			});
		});
	});
	nextSong.addEventListener('click', function(e) {
		let element = document.querySelector('.playing').nextElementSibling
		let target = ''
		if (element.dataset.playlistpk) {
			target = 'playlist'
		} else {
			target = 'favorite'
		}
		$.ajax({
			type:"get",
			url: requestUrl.value,
			data: {
				'current_pk': element.dataset.pk,
				'playlist_pk': element.dataset.playlistpk,
				'action': 'next',
				'target': target
			},
			success: function(response) {
				if (response != 'false') {
					let responseData = response.split(",")
					console.log(responseData[1]);
					if (responseData[1] != 'fav') {
						let parent = document.querySelectorAll(`[data-playlistpk~="${responseData[1]}"]`)[0].closest('.playlist_box');

						let nextMusic = parent.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
						let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
						
						currentSong = nextMusic
						initPlayAndPause(buttonCurrent)
					} else {
						let nextMusic = document.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
						let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
						
						currentSong = nextMusic
						initPlayAndPause(buttonCurrent)
					}
				}
			}
		});
	});
	prevSong.addEventListener('click', function(e) {
		let element = document.querySelector('.playing').nextElementSibling
		let target = ''
		if (element.dataset.playlistpk) {
			target = 'playlist'
		} else {
			target = 'favorite'
		}
		$.ajax({
			type:"get",
			url: requestUrl.value,
			data: {
				'current_pk': element.dataset.pk,
				'playlist_pk': element.dataset.playlistpk,
				'action': 'prev',
				'target': target
			},
			success: function(response) {
				if (response != 'false') {
					let responseData = response.split(",")
					console.log(responseData[1]);
					if (responseData[1] != 'fav') {
						let parent = document.querySelectorAll(`[data-playlistpk~="${responseData[1]}"]`)[0].closest('.playlist_box');

						let nextMusic = parent.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
						let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
						
						currentSong = nextMusic
						initPlayAndPause(buttonCurrent)
					} else {
						let nextMusic = document.querySelectorAll(`[data-pk~="${responseData[0]}"]`)[0];
						let buttonCurrent = nextMusic.closest('.music').querySelector('.save-button')
						
						currentSong = nextMusic
						initPlayAndPause(buttonCurrent)
					}
				}
			}
		});
	});
});