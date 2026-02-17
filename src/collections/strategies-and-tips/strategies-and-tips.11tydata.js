import {__, generatePermalink} from 'eleventy-plugin-fluid';
import slugify from '@sindresorhus/slugify';

export default {
	layout: 'layouts/strategy-tip',
	eleventyComputed: {
		permalink(data) {
			data.slug = slugify(data.title);
			return generatePermalink(data, 'strategies-and-tips', __('strategies-and-tips-slug', {}, data));
		},
	},
};
