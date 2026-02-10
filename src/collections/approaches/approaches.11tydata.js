import {__, generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

export default {
	layout: 'layouts/approach',
	eleventyComputed: {
		permalink(data) {
			data.slug = slugify(data.title);
			return generatePermalink(data, 'approaches', __('approaches-slug', {}, data));
		},
	},
};
