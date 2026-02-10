import {__, generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

export default {
	layout: 'layouts/opportunity',
	eleventyComputed: {
		permalink(data) {
			data.slug = slugify(data.title);
			return generatePermalink(data, 'opportunities', __('opportunities-slug', {}, data));
		},
	},
};
