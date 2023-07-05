export function initSlider() {
	document.querySelectorAll('.musics__container').forEach(n => {
		const slider = new Swiper(n.querySelector('.musics__cards-slider'), {
			navigation: {
				nextEl: n.querySelector('.music__next-slide'),
				prevEl: n.querySelector('.music__prev-slide'),
			},
			simulateTouch: true,
			slidesPerView: 5,
			spaceBetween: 25,
			autoHeight: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				500: {
					slidesPerView: 2,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1238: {
					slidesPerView: 4,
				},
				1536: {
					slidesPerView: 5,
				}
			},
		});
	});
}