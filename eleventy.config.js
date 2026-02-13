import {IdAttributePlugin, RenderPlugin} from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import fontAwesomePlugin from '@11ty/font-awesome';
import fluidPlugin from 'eleventy-plugin-fluid';
import {__} from 'eleventy-plugin-fluid';
import footnotesPlugin from 'eleventy-plugin-footnotes';
import _ from 'lodash';
import parseTransform from './src/_transforms/parse-transform.js';
import objectArrayPush from './src/assets/scripts/object-array-push.js';
import env from 'node:process';
import findTranslationKeyFilter from './src/_filters/find-translation-key-filter.js';

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig An instance of Eleventy's UserConfig class.
 * @returns {object} The configuration object.
 */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('now', () => new Date());
	eleventyConfig.addPlugin(fontAwesomePlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(footnotesPlugin);
	eleventyConfig.addPlugin(fluidPlugin, {
		defaultLanguage: 'en',
		supportedLanguages: {
			en: {
				slug: 'en',
				name: 'English',
			},
			fr: {
				slug: 'fr',
				name: 'Français',
				dir: 'ltr',
				uioSlug: 'fr',
			},
		},
	});

	for (const lang of ['en', 'fr']) {
		eleventyConfig.addCollection(`pages_${lang}`, collection => collection.getFilteredByGlob(`src/collections/pages/${lang}/*.md`));

		eleventyConfig.addCollection(`projects_${lang}`, collection => collection.getFilteredByGlob(`src/collections/projects/${lang}/*.md`));

		eleventyConfig.addCollection(`projectsubpages_${lang}`, collection => collection.getFilteredByGlob(`src/collections/project-subpages/${lang}/*.md`));

		eleventyConfig.addCollection(`resources_${lang}`, collection => collection.getFilteredByGlob(`src/collections/resources/${lang}/*.md`));

		eleventyConfig.addCollection(`topics_${lang}`, collection => collection.getFilteredByGlob(`src/collections/topics/${lang}/*.md`));
	}

	eleventyConfig.addFilter('objectArrayPush', objectArrayPush);
	eleventyConfig.addFilter('findTranslationKey', findTranslationKeyFilter);

	/*
	  Provide a custom duplicate of eleventy-plugin-fluid's uioInit shortcode in
    order to run it without the text-size preference.
  */
	eleventyConfig.addShortcode('uioCustomInit', (locale, direction) => {
		const options = {
			preferences: ['fluid.prefs.lineSpace', 'fluid.prefs.textFont', 'fluid.prefs.contrast', 'fluid.prefs.enhanceInputs'],
			auxiliarySchema: {
				terms: {
					templatePrefix: '/lib/infusion/src/framework/preferences/html',
					messagePrefix: '/lib/infusion/src/framework/preferences/messages',
				},
			},
			prefsEditorLoader: {
				lazyLoad: true,
			},
			locale,
			direction,
		};

		return `<script>fluid.uiOptions.multilingual(".flc-prefsEditor-separatedPanel", ${JSON.stringify(options)});</script>`;
	});

	eleventyConfig.addTransform('parse', parseTransform);

	eleventyConfig.addPassthroughCopy({
		'src/admin/config.yml': 'admin/config.yml',
	});

	eleventyConfig.addPassthroughCopy({'src/assets/fonts': 'assets/fonts'});
	eleventyConfig.addPassthroughCopy({'src/assets/icons': '/'});

	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPreprocessor('drafts', '*', (data, _content) => {
		if (data.draft && env.ELEVENTY_RUN_MODE === 'build') {
			return false;
		}
	});

	return {
		dir: {
			input: 'src',
		},
		templateFormats: ['njk', 'md', 'css', 'png', 'jpg', 'svg'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
}
