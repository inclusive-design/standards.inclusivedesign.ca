import {generatePermalink} from 'eleventy-plugin-fluid';

export default {
	permalink: data => generatePermalink(data, 'pages'),
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
	},
};
