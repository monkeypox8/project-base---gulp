// import libraries
import './lib/intersection-observer-polyfill';

// import modules
import lazyLoadImages from './modules/lazyload';


// lazyload images
if (document.querySelector('.lazyload') !== null) {
	lazyLoadImages();
}
