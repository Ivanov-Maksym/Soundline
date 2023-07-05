let can = true
$(document).ready(function() {
	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('save-button')) {
			saveData()
		}
		if (can) {
			setInterval(saveData, 4000)
			can = false
		}
	});
});

function saveData() {
	const currentSongParent = document.querySelector('.playing').closest('.music');
	const musicTitle = currentSongParent.querySelector('.music-title').textContent.slice(0, 10);
	const musicAuthor = currentSongParent.querySelector('.music-author').textContent.slice(0, 10);
	const musicImage = currentSongParent.querySelector('.music-image').src;
	const music = currentSongParent.querySelector('audio').children[0].src;
	const currentTime = currentSongParent.querySelector('audio').currentTime.toFixed(0);
	const volume = currentSongParent.querySelector('audio').volume;
	$.ajax({
		type:"get",
		url: $('#saveDataOfSong').val(),
		data: {
			'name': musicTitle,
			'author': musicAuthor,
			'image': musicImage,
			'file': music,
			'currentTime': currentTime,
			'volume': volume
		},
		success: function(response) {}
	});
	console.log(1);
}