import { convertToArray } from './util';



// replace img src with data-src attribute
function lazyImgSrc(item) {
	const src = item.getAttribute('data-src');
	if (!src) { return; }
	if (item.tagName === 'VIDEO') {
		item.poster = src;
	} else {
		item.src = src;
	}
}


// listens for image visibility in viewport via observer
function loadImages(images, observer) {
	images.forEach(function(entry) {
		if (entry.isIntersecting) {
			lazyImgSrc(entry.target);
			entry.target.classList.add('loaded');

			// detach listener
			observer.unobserve(entry.target);
		}

		if (document.querySelector('.ie') !== null || document.querySelector('.no-object-fit') !== null) {
			objectFitPolyfill();
		}
	});
}


export default function lazyLoadImages() {
	const imgOptions = {
		root: null,
		rootMargin: '10px'
	};

	// init intersection observers
	const imageObserver = new IntersectionObserver(loadImages, imgOptions);
	const lazyImages = convertToArray(document.querySelectorAll('.lazyload'));

	lazyImages.forEach(function(img) {
		imageObserver.observe(img);
	});

}

