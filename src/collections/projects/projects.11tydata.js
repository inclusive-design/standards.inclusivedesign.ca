import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/project',
	eleventyComputed: {
		eleventyNavigation: {
			key: data => data.slug,
			title: data => data.title,
			color: data => data.color,
			parent: data => __('projects', {}, data),
		},
		permalink: data => generatePermalink(data, 'projects', __('projects-slug', {}, data)),
	},
};
