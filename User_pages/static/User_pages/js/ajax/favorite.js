let canClick = true

$(document).ready(function() {
	if (canClick) {
		canClick = false
		$('.music__favorite').each(function(index, element){
			$(element).click(function(e) {
				$.ajax({
					type:"post",
					url: `${window.location.href}`,
					data: {
						'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
						'music_pk': $(element).val()
					},
					success: function(response) {
						canClick = true
					
						if (element.style.color == '') {
							element.style.color = '#fff'
						} else if (element.style.color == 'rgb(255, 152, 152)'){
							element.style.color = '#fff'
						} else {
							element.style.color = '#FF9898'
						}
					}
				});
			});
		});
	}
});