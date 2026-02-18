import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/resource.njk',
	eleventyComputed: {
		permalink(data) {
			if (data.link) {
				return false;
			}

			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'resources', __('resources-slug', {}, data));
		},
	},
};
