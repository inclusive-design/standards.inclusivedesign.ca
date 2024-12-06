import { generatePermalink } from "eleventy-plugin-fluid";

export default {
    permalink: (data) => {
        return generatePermalink(data, "pages");
    }
};
