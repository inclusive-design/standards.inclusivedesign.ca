import '@zachleat/filter-container';

window.addEventListener('load', () => {
	renderFilterTags();
	sortResources();
});

const filters = document.querySelector('#filters');
const checkedFilterOptions = filters.querySelectorAll('input[type=\'checkbox\']');
for (const checkbox of checkedFilterOptions) {
	checkbox.addEventListener('click', () => {
		renderFilterTags();
	});
}

const renderFilterTags = () => {
	const filterTags = document.querySelector('#filter-tags');
	filterTags.innerHTML = '';
	const filters = document.querySelector('#filters');
	const checkedFilterOptions = filters.querySelectorAll('input[type=\'checkbox\']:checked');
	if (checkedFilterOptions.length > 0) {
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'block';
		for (const option of checkedFilterOptions) {
			const checkbox = filters.querySelector(`label[for='${option.id}']`);
			const filterTag = document.createElement('button');
			filterTag.className = `filter-tag ${option.name}`;
			filterTag.addEventListener('click', () => {
				checkbox.click();
			});
			filterTag.innerHTML = checkbox.innerHTML;
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
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'none';
	}
};

const getSortOption = document.querySelector('#resourcesSortSelector');
getSortOption.addEventListener('change', event => {
	sortResources(event.target.value);
	event.target.selected = true;
});

const sortResources = sortBy => {
	const resourceContainer = document.querySelectorAll('.resources')[0];
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
