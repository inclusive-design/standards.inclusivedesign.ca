import {__, generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

export default {
	layout: 'layouts/barrier',
	eleventyComputed: {
		permalink(data) {
			data.slug = slugify(data.title);
			return generatePermalink(data, 'barriers', __('barriers-slug', {}, data));
		},
	},
};
