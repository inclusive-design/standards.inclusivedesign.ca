import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/resource.njk',
	eleventyComputed: {
		eleventyNavigation: {
			key: data => data.title,
			parent: data => __('resources', {}, data),
		},
		permalink(data) {
			if (data.linking.type === 'link') {
				return false;
			}

			data.slug = data.linking.slug;
			return generatePermalink(data, 'resources', __('resources-slug', {}, data));
		},
	},
};
