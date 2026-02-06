import {__, generatePermalink} from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/project-subpage',
	eleventyComputed: {
		eleventyNavigation: {
			key: data => data.title,
			title: data => data.title,
			parent: data => data.parent,
		},
		permalink(data) {
			const slug = `${data.parent}/${data.slug}`;
			data.slug = slug;
			return generatePermalink(data, 'projects', __('projects-slug', {}, data));
		},
	},
};
