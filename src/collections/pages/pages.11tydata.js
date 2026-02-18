import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	eleventyComputed: {
		eleventyNavigation(data) {
			if (data.order === 0) {
				return false;
			}

			return {
				key: data.translationKey,
				title: data.shortTitle === '' ? data.title : data.shortTitle,
				order: data.order,
			};
		},
		permalink(data) {
			data.slug = data.parent ? `${__(data.parent, {}, data)}/${data.page.fileSlug}` : data.page.fileSlug;
			return generatePermalink(data, 'pages');
		},
	},
};
