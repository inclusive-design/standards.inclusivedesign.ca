import { EleventyRenderPlugin } from "@11ty/eleventy";

export default function eleventy(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy({
        "src/admin/config.yml": "admin/config.yml"
    });

    eleventyConfig.addPassthroughCopy({
        "src/assets": "assets"
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_layouts",
            data: "_data"
        },
        templateFormats: ["njk", "md", "css", "png", "jpg", "svg"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
}
