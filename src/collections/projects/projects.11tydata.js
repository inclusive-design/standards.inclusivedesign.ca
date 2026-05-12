import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/project',
	eleventyComputed: {
		eleventyNavigation: {
			key: data => data.translationKey,
			title: data => data.title,
			color: data => data.color,
			parent: data => __('projects', {}, data),
		},
		permalink(data) {
			data.slug = data.page.fileSlug;
			return generatePermalink(data, 'projects', __('projects-slug', {}, data));
		},
	},
};
