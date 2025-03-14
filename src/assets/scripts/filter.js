import "@zachleat/filter-container";

const filterApplyButton = document.getElementById("apply");
filterApplyButton.addEventListener("click", () => {
    const filterTags = document.getElementById("filter-tags");
    filterTags.innerHTML = "";
    const filterProject = document.getElementById("filter-project");
    for (const option of filterProject.querySelectorAll("input[type='checkbox']:checked")) {
        const checkbox = filterProject.querySelector(`label[for='${option.id}']`);
        const filterTag = document.createElement("button");
        filterTag.addEventListener("click", () => {
            checkbox.click();
            document.getElementById("apply").click();
        });
        filterTag.innerHTML = checkbox.innerHTML;
        filterTags.appendChild(filterTag);
    }
});
