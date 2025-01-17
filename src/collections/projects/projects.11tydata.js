import { __, generatePermalink } from "eleventy-plugin-fluid";

export default {
    eleventyComputed: {
        layout: "layouts/project",
        permalink: (data) => {
            if (data.link) {
                return null;
            }

            return generatePermalink(data, "projects", __("projects-slug", {}, data));
        }
    }
};
