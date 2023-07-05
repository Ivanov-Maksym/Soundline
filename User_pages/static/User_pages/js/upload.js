const imageInput = document.querySelector('.imgInput');
const fileInput = document.querySelector('.fileInput');
const image = document.querySelector('.image');
const fileImage = document.querySelector('.file');

imageInput.addEventListener('change', function(e) {
	let file = this.files[0];
	let fr = new FileReader();
	fr.readAsDataURL(file);

	fr.onload = function() {
		image.src = fr.result
	}
});

fileInput.addEventListener('change', function(e) {
	fileImage.src = fileInput.dataset.url
});