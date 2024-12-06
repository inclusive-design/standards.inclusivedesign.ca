import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fluidPlugin from "eleventy-plugin-fluid";
import footnotesPlugin from "eleventy-plugin-footnotes";

export default function eleventy(eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(footnotesPlugin);
    eleventyConfig.addPlugin(fluidPlugin, {
        defaultLanguage: "en",
        supportedLanguages: {
            "en-CA": {
                slug: "en",
                name: "English"
            },
            "fr-CA": {
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

    eleventyConfig.addPassthroughCopy({
        "src/admin/config.yml": "admin/config.yml"
    });

    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });

    return {
        dir: {
            input: "src"
        },
        templateFormats: ["njk", "md", "css", "png", "jpg", "svg"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
}
