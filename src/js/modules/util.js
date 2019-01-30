// convert nodelist to array
export function convertToArray(obj) {
	return Array.prototype.slice.apply(obj);
}

// determine document loading state
export function docLoaded() {
	return document.readyState === 'interactive' || document.readyState === 'complete';
}



