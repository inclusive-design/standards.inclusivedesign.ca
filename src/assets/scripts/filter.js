/* eslint-disable import-x/no-unassigned-import -- Allow the filter-container web component to be bundled with the related code. */
import '@zachleat/filter-container';

window.addEventListener('load', () => {
	renderFilterTags();
	sortResources();
});

const filters = document.querySelector('#filters');
const filterOptions = filters.querySelectorAll('input[type=\'checkbox\']');
for (const checkbox of filterOptions) {
	checkbox.addEventListener('click', () => {
		renderFilterTags(filters);
	});
}

const renderFilterTags = () => {
	const filterTags = document.querySelector('#filter-tags');
	filterTags.replaceChildren();
	const checkedFilterOptions = filters.querySelectorAll('input[type=\'checkbox\']:checked');
	const filterApplied = document.querySelector('#filter-applied');
	if (checkedFilterOptions.length > 0) {
		filterApplied.style.display = 'block';
		for (const option of checkedFilterOptions) {
			const checkbox = filters.querySelector(`label[for='${CSS.escape(option.id)}']`);
			const filterTag = document.createElement('button');
			filterTag.className = `filter-tag ${option.name}`;
			filterTag.addEventListener('click', () => {
				checkbox.click();
			});
			filterTag.innerHTML = checkbox.getHTML();
			filterTags.append(filterTag);
		}

		const clearFiltersButton = document.createElement('button');
		clearFiltersButton.innerHTML = 'Clear filters';
		clearFiltersButton.addEventListener('click', () => {
			for (const checkbox of document.querySelectorAll('input[type="checkbox"]:checked')) {
				checkbox.click();
			}
		});
		filterTags.append(clearFiltersButton);
	} else {
		filterApplied.style.display = 'none';
	}
};

const getSortOption = document.querySelector('#resourcesSortSelector');
if (getSortOption) {
	getSortOption.addEventListener('change', (event) => {
		sortResources(event.target.value);
		event.target.selected = true;
	});
}

const sortResources = (sortBy) => {
	const resourceContainer = document.querySelector('.resources');
	if (resourceContainer) {
		const resources = [...resourceContainer.children];
		switch (sortBy) {
			case 'ascTitle': {
				resources.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
				break;
			}

			case 'ascDate': {
				resources.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
				break;
			}

			case 'decDate': {
				resources.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
				break;
			}

			default: {
				resources.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
				break;
			}
		}

		for (const resource of resources) {
			resourceContainer.append(resource);
		}
	}
};
