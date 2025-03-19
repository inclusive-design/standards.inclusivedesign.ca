import "@zachleat/filter-container";

window.onload = () => {
    renderFilterTags();
};

const filterApplyButton = document.getElementById("apply");
filterApplyButton.addEventListener("click", () => {
    renderFilterTags();
});

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
                filterApplyButton.click();
            });
            filterTag.innerHTML = checkbox.innerHTML;
            filterTags.appendChild(filterTag);
        }
        const clearFiltersButton = document.createElement("button");
        clearFiltersButton.innerHTML = "Clear filters";
        clearFiltersButton.addEventListener("click", () => {
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => (checkbox.checked = false));
            filterApplyButton.click();
        });
        filterTags.appendChild(clearFiltersButton);
    } else {
        const filterApplied = document.getElementById("filter-applied");
        filterApplied.style.display = "none";
    }
};
