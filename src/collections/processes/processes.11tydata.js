import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/process',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'processes', __('processes-slug', {}, data));
		},
	},
};
