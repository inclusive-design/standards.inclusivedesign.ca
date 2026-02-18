import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/strategy-tip',
	eleventyComputed: {
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'strategies-and-tips', __('strategies-and-tips-slug', {}, data));
		},
	},
};
