const audio = document.querySelector('.overview-audio')
const playButton = document.querySelector('.overview-controls__play'),
	loopButton = document.querySelector('.overview-controls__loop'),
	timerMinutes = document.querySelector('.overview-controls-minutes'),
	timerSeconds = document.querySelector('.overview-controls-seconds'),
	progressContainer = document.querySelector('.overview-controls__progress-container'),
	progress = document.querySelector('.overview-controls__progress'),
	volumeIcon = document.querySelector('.overview-volume__icon'),
	volumeProgressContainer = document.querySelector('.overview-volume__progress-container'),
	volumeProgress = document.querySelector('.overview-volume__progress');

const controlsPlay = document.querySelector('.controls__play');

controlsPlay.addEventListener('click', function(e) {
	audio.pause()
	playButton.classList.add('_icon-play');
	playButton.classList.remove('_icon-pause');
});

let volume = 1

loopButton.addEventListener('click', loopMusic)
audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
volumeProgressContainer.addEventListener('click', setVolume)

playButton.addEventListener('click', function(e){
	if (document.querySelector('.controls__audio')) {
		document.querySelector('.controls__audio').pause()
	}

	if (document.querySelector('.playing')) {
		let hiddenMusic = document.querySelector('.playing').closest('.music');
		let currentSong = hiddenMusic.querySelector('.audio');
		currentSong.pause();
		controlsPlay.classList.add('_icon-play');
		controlsPlay.classList.remove('_icon-pause');
	}

	if (playButton.classList.contains('_icon-play')) {
		audio.play()
		setInterval(updateTimer, 1000)
		playButton.classList.remove('_icon-play')
		playButton.classList.add('_icon-pause')
	} else {
		audio.pause()
		playButton.classList.add('_icon-play')
		playButton.classList.remove('_icon-pause')
	}
});

volumeIcon.addEventListener('click', function (e) {
	if (volumeIcon.classList.contains('disable')) {
		audio.volume = volume
		volumeIcon.classList.remove('disable')
	} else {
		volume = audio.volume
		audio.volume = 0
		volumeIcon.classList.add('disable')
	}
});

audio.addEventListener('ended', function(e) {
	playButton.classList.add('_icon-play')
	playButton.classList.remove('_icon-pause')
});

function loopMusic(event) {
	if (audio.loop == false) {
		loopButton.style.color = '#4294FF'
		audio.loop = true
	} else {
		loopButton.style.color = '#fff'
		audio.loop = false
	}
}

function updateTimer() {
	let time = Number(audio.currentTime.toFixed(0));

	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	timerMinutes.textContent = `0${minutes}`;

	if (seconds > 9) {
		timerSeconds.textContent = seconds
	} else {
		timerSeconds.textContent = `0${seconds}`
	}
}

function updateProgress(event) {
	const { duration, currentTime } = event.srcElement
	const progressPercents = (currentTime / duration) * 100
	
	progress.style.width = `${progressPercents}%`
}

function setProgress(event) {
	const width = progressContainer.clientWidth
	const clickPoint = event.offsetX
	const duration = audio.duration

	audio.currentTime = (clickPoint / width) * duration
}

function setVolume(event) {
	const width = volumeProgressContainer.clientWidth
	const clickPoint = event.offsetX
	volumeIcon.classList.remove('disable')

	volume = clickPoint / width
	audio.volume = volume
	volumeProgress.style.width = `${(clickPoint / width) * 100}%`
}