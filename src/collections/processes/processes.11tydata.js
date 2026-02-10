import {__, generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

export default {
	layout: 'layouts/process',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.shortTitle ? slugify(data.shortTitle) : slugify(data.title);
			return generatePermalink(data, 'processes', __('processes-slug', {}, data));
		},
	},
};
