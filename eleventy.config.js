import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import brokenLinksPlugin from "eleventy-plugin-broken-links";
import fluidPlugin from "eleventy-plugin-fluid";
import footnotesPlugin from "eleventy-plugin-footnotes";
import parse from "./src/_transforms/parse.js";

export default function eleventy(eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(EleventyRenderPlugin);
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
    });

    eleventyConfig.addShortcode("findTranslation", function find(collection = [], page, lang, desiredLang) {
        const expectedFilePathStem = page.filePathStem.replace(lang, desiredLang);
        let url = page.url;
        collection.forEach((el) => {
            if (el.filePathStem === expectedFilePathStem) {
                url = el.url;
            }
        });
        return url;
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

    return {
        dir: {
            input: "src"
        },
        templateFormats: ["njk", "md", "css", "png", "jpg", "svg"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
}
