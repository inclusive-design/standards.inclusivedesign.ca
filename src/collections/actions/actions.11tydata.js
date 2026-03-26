import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/action',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'actions', __('actions-slug', {}, data));
		},
	},
};
