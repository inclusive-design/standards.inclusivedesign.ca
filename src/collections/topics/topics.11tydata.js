import { __, generatePermalink } from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/topic',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'topics', __('topics-slug', {}, data));
		},
	},
};
