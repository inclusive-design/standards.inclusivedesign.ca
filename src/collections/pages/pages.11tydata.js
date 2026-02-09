import {generatePermalink} from 'eleventy-plugin-fluid';

export default {
	eleventyComputed: {
		eleventyNavigation(data) {
			if (data.order === 0) {
				return false;
			}

			return {
				key: data.shortTitle ?? data.title,
				order: data.order,
			};
		},
		permalink(data) {
			data.slug = data.parent ? `${data.parent}/${data.page.fileSlug}` : data.page.fileSlug;
			return generatePermalink(data, 'pages');
		},
	},
};
