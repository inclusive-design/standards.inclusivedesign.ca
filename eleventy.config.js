import { IdAttributePlugin, RenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import brokenLinksPlugin from "eleventy-plugin-broken-links";
import fluidPlugin from "eleventy-plugin-fluid";
import footnotesPlugin from "eleventy-plugin-footnotes";
import parse from "./src/_transforms/parse.js";

export default function eleventy(eleventyConfig) {
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

        eleventyConfig.addCollection(`events_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/collections/events/${lang}/*.md`);
        });

        eleventyConfig.addCollection(`announcements_${lang}`, (collection) => {
            return collection.getFilteredByGlob(`src/announcements/announcements/${lang}/*.md`);
        });
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

    eleventyConfig.addPairedShortcode("accordion", async function (content, label) {
        const contentRenderer = await RenderPlugin.String(content, "md", {});
        const renderedContent = await contentRenderer();

        return `<details class="accordion">
        <summary>${label}</summary>
        <div class="accordion__content">${renderedContent}</div>
      </details>`;
    });

    eleventyConfig.addTransform("parse", parse);

    eleventyConfig.addPassthroughCopy({
        "src/admin/config.yml": "admin/config.yml"
    });

    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });

    eleventyConfig.addPlugin(brokenLinksPlugin, {
        forbidden: "error",
        broken: "error",
        cacheDuration: "60s",
        loggingLevel: 1,
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
