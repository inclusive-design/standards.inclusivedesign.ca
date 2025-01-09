import { generatePermalink } from "eleventy-plugin-fluid";

export default {
    eleventyComputed: {
        permalink: (data) => {
            if (data.link) {
                return null;
            }

            const locale = data.locale;
            return generatePermalink(data, "projects", locale === "fr-CA" ? "projets" : "projects");
        }
    }
};
