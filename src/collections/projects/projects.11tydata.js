import { __, generatePermalink } from "eleventy-plugin-fluid";

export default {
    layout: "layouts/project",
    eleventyComputed: {
        eleventyNavigation: {
            key: (data) => data.slug,
            title: (data) => data.title,
            color: (data) => data.color
        },
        permalink: (data) => {
            return generatePermalink(data, "projects", __("projects-slug", {}, data));
        }
    }
};
