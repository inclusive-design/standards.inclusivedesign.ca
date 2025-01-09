import { parseHTML } from "linkedom";

export default (value, outputPath) => {
    if (outputPath && outputPath.includes(".html")) {
        const { document } = parseHTML(value);

        const sectionHeadings = document.querySelectorAll("main.sectioned h2:not([class])");
        if (sectionHeadings.length > 0) {
            for (const heading of sectionHeadings) {
                const getContent = (elem) => {
                    let elems = [];
                    while (elem.nextElementSibling && elem.nextElementSibling.tagName !== "H2" && elem.nextElementSibling.tagName !== "SECTION") {
                        elems.push(elem.nextElementSibling);
                        elem = elem.nextElementSibling;
                    }

                    elems.forEach((node) => {
                        node.parentNode.removeChild(node);
                    });

                    return elems;
                };
                let contents = getContent(heading);
                let section = document.createElement("section");
                contents.forEach((node) => {
                    section.appendChild(node);
                });
                heading.parentNode.insertBefore(section, heading.nextElementSibling);
                section.prepend(heading);
            }
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement?.outerHTML;
    }

    return value;
};
