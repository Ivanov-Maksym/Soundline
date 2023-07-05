const menuIcon = document.querySelector('.icon-menu');

if (document.querySelector('.playing')) {
	document.body.classList.add('ctrl-active');
}

menuIcon.addEventListener('click', function (e) {
	if (document.body.classList.contains('search-active')) {
		document.body.classList.remove('search-active');
	}
	if (document.body.classList.contains('menu-active')) {
		document.body.classList.remove('menu-active');
		setTimeout(allowOverflow, 300)
	} else {
		document.body.classList.add('menu-active');
		document.body.style.overflow = 'hidden'
	}
});

if (window.matchMedia("(max-width: 928px)").matches) {
	const searchButton = document.querySelector('.aside__fake-button');
	
	searchButton.addEventListener('click', function(e) {
		if (document.body.classList.contains('menu-active')) {
			document.body.classList.remove('menu-active');
		}
		if (document.body.classList.contains('search-active')) {
			document.body.classList.remove('search-active');
			setTimeout(allowOverflow, 300)
		} else {
			document.body.classList.add('search-active');
			document.body.style.overflow = 'hidden'
		}
	});
}

function allowOverflow() {
	document.body.style.overflow = 'auto'
}