import fs from "node:fs";
import { __, generatePermalink } from "eleventy-plugin-fluid";
import matter from "gray-matter";

export default {
    layout: "layouts/project-subpage",
    eleventyComputed: {
        eleventyNavigation: {
            key: (data) => data.title,
            title: (data) => data.title,
            parent: (data) => data.parent
        },
        permalink: function (data) {
            const slug = `${data.parent}/${data.slug}`;
            data.slug = slug;
            return generatePermalink(data, "projects", __("projects-slug", {}, data));
        }
    }
};
