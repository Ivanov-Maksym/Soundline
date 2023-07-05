let canClick = true

$(document).ready(function() {
	if (!document.querySelector('._icon-favorite').classList.contains('disabled')) {
		if (canClick) {
			canClick = false
			$('._icon-favorite').click(function(e) {
				$.ajax({
					type:"post",
					url: `${window.location.href}`,
					data: {
						'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
						'music_pk': $('.actions__button').val()
					},
					success: function(response) {
						canClick = true
						favoriteButton = document.querySelector('.actions__button')
		
						if (favoriteButton.style.color == '') {
							favoriteButton.style.color = '#FF9898'
						} else if (favoriteButton.style.color == 'rgb(255, 152, 152)'){
							favoriteButton.style.color = '#fff'
						} else {
							favoriteButton.style.color = '#FF9898'
						}
					}
				});
			});
		}
	}
	$(".select__checkbox").each(function(index, element){
		$(element).change(function(e) {
			$.ajax({
				type:"post",
				url: `${window.location.href}`,
				data: {
					'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
					'playlist_pk': $(element).val()
				},
				success: function(response) {
					
				}
			});
		});
	});
	$('.add-playlist').submit(function(e) {
		e.preventDefault();
		$.ajax({
			type:"post",
			url: `${window.location.href}`,
			data: {
				'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
				'newPlaylistName': $('.add-playlist__input').val()
			},
			success: function(response) {
				location.reload()
			}
		});
	});
	$(".select__delete").each(function(index, element){
		$(element).click(function(e) {
			let btn = element
			$.ajax({
				type:"post",
				url: `${window.location.href}`,
				data: {
					'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
					'del_playlist_pk': btn.getAttribute('value')
				},
				success: function(response) {
					element.closest('.select__group').remove()
				}
			});
		});
	});
});

function hideError() {
	let errorText = document.querySelector(".error-text");
	errorText.style.transform = 'translate(200%, 0px)'
}