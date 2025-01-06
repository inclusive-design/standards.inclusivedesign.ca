import { parseHTML } from "linkedom";

export default (value, outputPath) => {
    if (outputPath && outputPath.includes(".html")) {
        const { document } = parseHTML(value);
        if (document) {
            const main = document.getElementsByTagName("main");
            const updatedMain = document.createElement("main");
            let section = document.createElement("section");

            if (main[0]?.children) {
                for (const element of main[0].children) {
                    if (element.tagName === "H2" && element.classList?.length === 0) {
                        if (section.children.length > 0) {
                            updatedMain.append(section);
                            section = document.createElement("section");
                        }
                        section.append(element);
                    } else if (element.tagName === "P" && element.classList?.length === 0) {
                        section.append(element);
                    } else {
                        if (section.children.length > 0) {
                            updatedMain.append(section);
                        }
                        updatedMain.append(element);
                    }
                }
                main[0].replaceWith(updatedMain);
            }

            return "<!DOCTYPE html>\r\n" + document.documentElement?.outerHTML;
        }
    }

    return value;
};
