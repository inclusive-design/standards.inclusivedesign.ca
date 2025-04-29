import { randomUUID } from "node:crypto";
import { IdAttributePlugin, RenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fontAwesomePlugin from "@11ty/font-awesome";
import brokenLinksPlugin from "eleventy-plugin-broken-links";
import fluidPlugin from "eleventy-plugin-fluid";
import { __ } from "eleventy-plugin-fluid";
import footnotesPlugin from "eleventy-plugin-footnotes";
import _ from "lodash";
import parse from "./src/_transforms/parse.js";

export default function eleventy(eleventyConfig) {
    eleventyConfig.addGlobalData("now", () => new Date());
    eleventyConfig.addPlugin(fontAwesomePlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(RenderPlugin);
    eleventyConfig.addPlugin(footnotesPlugin);
    eleventyConfig.addPlugin(fluidPlugin, {
        defaultLanguage: "en",
        supportedLanguages: {
            en: {
                slug: "en",
                name: "English"
            },
            fr: {
                slug: "fr",
                name: "Français",
                dir: "ltr",
                uioSlug: "fr"
            }
        }
    });

    ["en", "fr"].forEach((lang) => {
        eleventyConfig.addCollection(`pages_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/pages/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`projects_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/projects/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`projectsubpages_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/project-subpages/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`events_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/events/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`resources_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/resources/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`topics_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/topics/${lang}/*.md`);
        });
    });

    eleventyConfig.addFilter("find", function find(collection = [], key = "", value) {
        return collection.find((post) => _.get(post, key) === value);
    });

    eleventyConfig.addFilter("objectArrayPush", (obj, key, value) => {
        if (Array.isArray(value)) {
            obj[key] = [...new Set([...obj[key], ...value])];
        } else {
            if (!obj[key].includes(value)) {
                obj[key].push(value);
            }
        }
        return obj;
    });

    eleventyConfig.addFilter("findTranslation", function find(page, collection = [], lang, desiredLang) {
        const expectedFilePathStem = page.filePathStem.replace(lang, desiredLang);

        let translationUrl = false;

        collection.forEach((el) => {
            if (el.filePathStem === expectedFilePathStem) {
                translationUrl = el.url;
            }
        });
        return translationUrl;
    });

    /*
        Provide a custom duplicate of eleventy-plugin-fluid's uioInit shortcode in
        order to run it without the text-size preference.
    */
    eleventyConfig.addShortcode("uioCustomInit", (locale, direction) => {
        let options = {
            preferences: ["fluid.prefs.lineSpace", "fluid.prefs.textFont", "fluid.prefs.contrast", "fluid.prefs.enhanceInputs"],
            auxiliarySchema: {
                terms: {
                    templatePrefix: "/lib/infusion/src/framework/preferences/html",
                    messagePrefix: "/lib/infusion/src/framework/preferences/messages"
                }
            },
            prefsEditorLoader: {
                lazyLoad: true
            },
            locale: locale,
            direction: direction
        };

        return `<script>fluid.uiOptions.multilingual(".flc-prefsEditor-separatedPanel", ${JSON.stringify(options)});</script>`;
    });

    eleventyConfig.addTransform("parse", parse);

    eleventyConfig.addPassthroughCopy({
        "src/admin/config.yml": "admin/config.yml"
    });

    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });

    eleventyConfig.addPlugin(brokenLinksPlugin, {
        forbidden: "warn",
        broken: "warn",
        cacheDuration: "60s",
        loggingLevel: 2,
        excludeInputs: ["**/*/*.css"]
    });

    eleventyConfig.addPlugin(IdAttributePlugin);

    return {
        dir: {
            input: "src"
        },
        templateFormats: ["njk", "md", "css", "png", "jpg", "svg"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
}
