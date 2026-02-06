/**
 * Push content to an array property of an object, filtering out duplicate items.
 * @param {object} object - The object to which we're pushing new items.
 * @param {string} key - The key of the array property to which we're pushing new items.
 * @param {Array | string} value - The new item or items we are pushing to the object.
 * @returns {object} The updated object.
 */
export default function objectArrayPush(object, key, value) {
	if (Array.isArray(value)) {
		object[key] = [...new Set([...object[key], ...value])];
	} else if (!object[key].includes(value)) {
		object[key].push(value);
	}

	return object;
}
