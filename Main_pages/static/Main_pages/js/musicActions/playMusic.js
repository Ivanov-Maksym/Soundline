export function stopCurrentlyPlaying(controlsPlay, e, currentSong, loopButton, volumeIcon) {
	if (document.querySelector('.playing') != null & e.target != document.querySelector('.playing')) {
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
}

export function cardPlayAndPauseActions(e, controlsTitle, controlsAuthor, currentPlayButton, controlsPlay, volumeProgress, controlsImage, currentSong) {
	if (e.target.classList.contains('_icon-play')) {
		controlsTitle.textContent = e.target.closest('.card__body').children[0].children[0].textContent
		controlsAuthor.textContent = e.target.closest('.card__body').children[0].children[1].textContent

		currentSong.play()
		currentPlayButton.classList.remove('_icon-play')
		currentPlayButton.classList.add('_icon-pause')
		currentPlayButton.classList.add('playing')

		controlsPlay.classList.remove('_icon-play')
		controlsPlay.classList.add('_icon-pause')

		volumeProgress.style.width = `${currentSong.volume * 100}%`

		controlsImage.src = e.target.closest('.card').children[0].children[0].src
	} else {
		currentSong.pause()
		currentPlayButton.classList.add('_icon-play')
		currentPlayButton.classList.remove('_icon-pause')

		controlsPlay.classList.add('_icon-play')
		controlsPlay.classList.remove('_icon-pause')
	}
}