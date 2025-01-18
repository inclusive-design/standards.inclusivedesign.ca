import { parseHTML } from "linkedom";

export default (value, outputPath) => {
    if (outputPath && outputPath.includes(".html")) {
        const { document } = parseHTML(value);

        const sectionHeadings = document.querySelectorAll("main.sectioned > h2:not([class])");
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
                let wrapper = document.createElement("div");
                wrapper.className = "wrapper flow";
                contents.forEach((node) => {
                    wrapper.appendChild(node);
                });
                section.appendChild(wrapper);
                heading.parentNode.insertBefore(section, heading.nextElementSibling);
                wrapper.prepend(heading);
            }
        }

        const pageNavHeadings = document.querySelectorAll("main:has(nav) h2");
        if (pageNavHeadings.length > 0) {
            const navContainer = document.querySelector("main nav ul");
            for (const heading of pageNavHeadings) {
                if (heading.parentNode.tagName !== "NAV") {
                    const link = document.createElement("a");
                    link.setAttribute("href", `#${heading.id}`);
                    link.innerHTML = heading.innerText;
                    const li = document.createElement("li");
                    li.appendChild(link);
                    navContainer.appendChild(li);
                }
            }
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement?.outerHTML;
    }

    return value;
};
