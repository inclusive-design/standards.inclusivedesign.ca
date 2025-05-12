import "@zachleat/filter-container";

window.onload = () => {
    renderFilterTags();
    sortResources();
};

const filters = document.getElementById("filters");
const checkedFilterOptions = filters.querySelectorAll("input[type='checkbox']");
for (const checkbox of checkedFilterOptions) {
    checkbox.addEventListener("click", () => {
        renderFilterTags();
    });
}

const renderFilterTags = () => {
    const filterTags = document.getElementById("filter-tags");
    filterTags.innerHTML = "";
    const filters = document.getElementById("filters");
    const checkedFilterOptions = filters.querySelectorAll("input[type='checkbox']:checked");
    if (checkedFilterOptions.length > 0) {
        const filterApplied = document.getElementById("filter-applied");
        filterApplied.style.display = "block";
        for (const option of checkedFilterOptions) {
            const checkbox = filters.querySelector(`label[for='${option.id}']`);
            const filterTag = document.createElement("button");
            filterTag.className = `filter-tag ${option.name}`;
            filterTag.addEventListener("click", () => {
                checkbox.click();
            });
            filterTag.innerHTML = checkbox.innerHTML;
            filterTags.appendChild(filterTag);
        }
        const clearFiltersButton = document.createElement("button");
        clearFiltersButton.innerHTML = "Clear filters";
        clearFiltersButton.addEventListener("click", () => {
            document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => checkbox.click());
        });
        filterTags.appendChild(clearFiltersButton);
    } else {
        const filterApplied = document.getElementById("filter-applied");
        filterApplied.style.display = "none";
    }
};

const getSortOption = document.getElementById("resourcesSortSelector");
getSortOption.addEventListener("change", (e) => {
    sortResources(e.target.value);
    e.target.selected = true;
});

const sortResources = (sortBy) => {
    const resourceContainer = document.getElementsByClassName("resources")[0];
    if (resourceContainer) {
        const resources = Array.from(resourceContainer.children);
        switch (sortBy) {
            case "ascTitle":
                resources.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
                break;
            case "ascDate":
                resources.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
                break;
            case "decDate":
                resources.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
                break;
            default:
                resources.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
                break;
        }
        for (const resource of resources) {
            resourceContainer.appendChild(resource);
        }
    }
};
