/**
	* Converts nodelist to array for use in forEach, etc.
	* @param {nodelist} items Typically a nodelist obtained from querySelectorAll
*/
export function convertToArray(items) {
	return Array.prototype.slice.apply(items);
}

/**
	* Determine document loading state
	* @return {bool} Document is not 'loading'
*/
export function docLoaded() {
	return document.readyState === 'interactive' || document.readyState === 'complete';
}

