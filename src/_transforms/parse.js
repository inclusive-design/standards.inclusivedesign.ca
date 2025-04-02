import { parseHTML } from "linkedom";

export default (value, outputPath) => {
    if (outputPath && outputPath.includes(".html")) {
        const { document } = parseHTML(value);

        const main = document.querySelector("main.sectioned");
        if (main) {
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
            } else {
                // If there are no H2 elements, we still want to wrap the content in a section.
                const contents = document.querySelectorAll("main.sectioned > *:not(.banner, section)");

                let section = document.createElement("section");
                let wrapper = document.createElement("div");
                wrapper.className = "wrapper flow";
                contents.forEach((node) => {
                    wrapper.appendChild(node);
                });
                section.appendChild(wrapper);
                const banner = main.querySelector(".banner");
                if (banner) {
                    banner.after(section);
                } else {
                    main.prepend(section);
                }
            }
        }

        const pageNavHeadings = document.querySelectorAll("main:has(nav) article h2");
        if (pageNavHeadings.length > 0) {
            const navContainer = document.querySelector("main nav #toc ul");
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

        const selects = document.querySelectorAll("select:not(.flc-prefsEditor-text-font)");
        if (selects.length > 0) {
            for (const select of selects) {
                const selectContainer = document.createElement("div");
                selectContainer.className = "select";
                select.parentNode.insertBefore(selectContainer, select);
                selectContainer.appendChild(select);
            }
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement?.outerHTML;
    }

    return value;
};
