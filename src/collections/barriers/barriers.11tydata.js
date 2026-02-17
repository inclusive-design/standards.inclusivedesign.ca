import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/barrier',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'barriers', __('barriers-slug', {}, data));
		},
	},
};
