import { __, generatePermalink } from "eleventy-plugin-fluid";

export default {
    layout: "layouts/project",
    eleventyComputed: {
        permalink: (data) => {
            if (data.link) {
                return null;
            }

            return generatePermalink(data, "projects", __("projects-slug", {}, data));
        }
    }
};
