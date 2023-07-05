const showModalButton = document.querySelector('._icon-plus');
const modalWindow = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const cover = document.querySelector('.cover');

const fakeCheckbox = document.querySelectorAll('.select__fake-chekbox');
const checkbox = document.querySelectorAll('.select__checkbox');
const addNewPlaylist = document.querySelector('.modal__button');
const addNewPlaylistForm = document.querySelector('.add-playlist');

if (checkbox) {
	checkbox.forEach(element => {
		if (element.checked) {
			let label = element.closest('label').children
			label[label.length - 1].classList.add('checked');
		}
	});
}

function allowScroll() {
	document.body.style.overflowY = 'auto';
	document.body.style.paddingRight = '0px';
}

function blockScroll() {
	document.body.style.overflowY = 'hidden';
}

document.addEventListener('click', function(e) {
	if (e.target.closest('.modal__close') != null || e.target == cover) {
		document.body.classList.remove('modal-active');
		setTimeout(allowScroll, 300)
		modalWindow.style.transform = `translate(-50%, -800%)`;
	}
	if (!showModalButton.classList.contains('disabled')) {
		if (e.target == showModalButton) {
			let scrollBarWidth = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
			document.body.classList.add('modal-active');
			blockScroll()
			document.body.style.paddingRight = scrollBarWidth;
			modalWindow.style.transform = `translate(-50%, -50%)`;
		}
	}

	fakeCheckbox.forEach(element => {
		if (e.target == element) {
			if (element.classList.contains('checked')) {
				element.classList.remove('checked');
			} else {
				element.classList.add('checked');
			}
		}
	});

	if (e.target == addNewPlaylist) {
		addNewPlaylistForm.style.display = 'flex';
	}
})