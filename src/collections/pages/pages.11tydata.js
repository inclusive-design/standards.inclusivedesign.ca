import {generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

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
			const slug = data.shortTitle ? slugify(data.shortTitle) : slugify(data.title);
			data.slug = data.parent ? `${data.parent}/${slug}` : slug;
			return generatePermalink(data, 'pages');
		},
	},
};
