import { __, generatePermalink } from 'eleventy-plugin-fluid';

export default {
	eleventyComputed: {
		eleventyNavigation(data) {
			if (data.order === 0 || data.order === null) {
				return false;
			}

			return {
				key: data.translationKey,
				title: data.shortTitle === '' ? data.title : data.shortTitle,
				order: data.order,
				parent: data.parent || undefined,
			};
		},
		permalink(data) {
			if (data.translationKey === 'browse') {
				return false;
			}

			let parent = false;

			if (data.parent) {
				parent = data.parent === 'browse' ? 'guidelines' : data.parent;
			}

			data.slug = parent ? `${__(parent, {}, data)}/${data.page.fileSlug}` : data.page.fileSlug;
			return generatePermalink(data, 'pages');
		},
	},
};
