import { initSlider } from './slider.js';
import { stopCurrentlyPlaying, cardPlayAndPauseActions} from './musicActions/playMusic.js';

initSlider() //swiper initialization

const playButton = document.querySelectorAll('.card__button');
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
const allAudio = document.querySelectorAll('.audio')

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

	currentSong.addEventListener('ended', function (e) {
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')
		controlsPlay.classList.add('_icon-play')
		controlsPlay.classList.remove('_icon-pause')
	});

	currentSong.addEventListener('timeupdate', updateProgress);
	progressContainer.addEventListener('click', setProgress);
	volumeProgressContainer.addEventListener('click', setVolume);
	currentSong.currentTime = savedDataAudio.currenttime;
	setInterval(updateTimer, 1000)
}

playButton.forEach(element => {
	element.addEventListener('click', function (e) {
		stopCurrentlyPlaying(controlsPlay, e, currentSong, loopButton, volumeIcon)

		document.body.classList.add('ctrl-active')
		currentPlayButton = e.target

		if (document.querySelector('.controls__audio')) {
			document.querySelector('.controls__audio').remove()
		}

		currentSong = e.target.nextElementSibling

		setInterval(updateTimer, 1000)
		currentSong.volume = volume

		currentSong.addEventListener('ended', function(e) {
			currentPlayButton.classList.add('_icon-play')
			currentPlayButton.classList.remove('_icon-pause')
			controlsPlay.classList.add('_icon-play')
			controlsPlay.classList.remove('_icon-pause')
		});

		// event listeners
		currentSong.addEventListener('timeupdate', updateProgress);
		progressContainer.addEventListener('click', setProgress);
		volumeProgressContainer.addEventListener('click', setVolume);

		cardPlayAndPauseActions(
			e,
			controlsTitle,
			controlsAuthor,
			currentPlayButton,
			controlsPlay,
			volumeProgress,
			controlsImage,
			currentSong
		)
	});
});

loopButton.addEventListener('click', loopMusic);
controlsPlay.addEventListener('click', playAndPauseMusic);
volumeIcon.addEventListener('click', disableVolume);

// disable volume to audio -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function disableVolume(e) {
	if (volumeIcon.classList.contains('disable')) {
		currentSong.volume = volume
		volumeIcon.classList.remove('disable')
	} else {
		volume = currentSong.volume
		currentSong.volume = 0
		volumeIcon.classList.add('disable')
	}
}

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