/**
 * @param {object} page - The current page's data object.
 * @param {object} collection - The collection in which to search (must contain the current page).
 * @param {string} lang - The language of the current page.
 * @param {string} desiredLang - The language of the translated page.
 * @returns {string|false} The URL of the treanslated page, or false if no translation is found.
 */
export default function findTranslationKeyFilter(page, collection = [], lang, desiredLang) {
	let translationUrl = false;

	for (const element of collection) {
		if (element.data.translationKey === this.ctx.translationKey && element.data.lang === desiredLang) {
			translationUrl = element.url;
			console.log(translationUrl);
		}
	}

	return translationUrl;
}
