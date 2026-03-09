import {I18n} from 'i18n-js';

const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

const constructHeading = (level = 2, i18n) => `<h${level}>${i18n.t('search-results')}</h${level}>`;

const constructSummary = (term, count, i18n) => `<strong>${i18n.t('search-results-summary', {term, count})}</strong>`;

const constructResults = (
	results,
	svgs,
	i18n,
) => {
	let searchResults = '';

	for (const result of results) {
		searchResults += `
            <li>
                <div class="search-results__title">
                    <h3><a href="${result.url}">${result.meta.title}</a></h3>
                    <em>${svgs[result.filters.type]} ${i18n.t(result.filters.type)}</em>
                </div>
                <p class="search-results__excerpt">${result.excerpt}</p>
            </li>
        `;
	}

	return `<ol class="search-results" role="list">${searchResults}</ol>`;
};

const constructHREF = (baseURL, parameters = {}, withOrigin = true) => {
	const url = new URL(baseURL);
	for (const parameter in parameters) {
		if (Object.hasOwn(parameters, parameter)) {
			url.searchParams.set(parameter, parameters[parameter]);
		}
	}

	return withOrigin ? url.href : url.href.slice(url.origin.length);
};

const constructPageLinks = (pages, page = 1, svgs, i18n) => {
	if (pages <= 1) {
		return '';
	}

	const baseURL = globalThis.location;
	const current = clamp(page, 1, pages);
	const previous
		= `<li><a class="pagination-link" href="${constructHREF(baseURL, {page: current - 1})}		" rel="prev"><span class="visually-hidden">${i18n.t('previous')}</span>${svgs.previous}</a></li>`;
	const next = `<li><a class="pagination-link" href="${constructHREF(baseURL, {page: current + 1})}" rel="next"><span class="visually-hidden">${i18n.t('next')}</span>${svgs.next}</a></li>`;

	let pageLinks = '';

	for (let index = 1; index <= pages; index++) {
		pageLinks += `<li><a class="pagination-link" href="${constructHREF(baseURL, {page: index})}" ${index === current ? 'aria-current="page"' : ''}>${index}</a></li>`;
	}

	return `
        <nav class="pagination" aria-label="Search pagination">
            <ul role="list">
                ${current > 1 ? previous : ''}
                ${pageLinks}
                ${current < pages ? next : ''}
            </ul>
        </nav>
    `;
};

const getPagedResults = async (search, page = 1, itemsPerPage = 5) => {
	const pages = Math.ceil(search.results.length / itemsPerPage);
	const start = clamp(page - 1, 0, pages) * itemsPerPage;
	const end = Math.max(start, Math.min(start + 5, search.results.length));
	return Promise.all(search.results.slice(start, end).map(r => r.data()));
};

const render = async (search, term, page = 1, options) => {
	const options_ = {
		itemsPerPage: 6,
		...options,
	};

	const i18n = new I18n(options_.translations);
	i18n.locale = options_.lang;

	const containerElm = document.querySelector(options.resultsSelector);
	const pages = Math.ceil(search.results.length / options_.itemsPerPage);
	const pagedResults = await getPagedResults(search, page, options_.itemsPerPage);

	containerElm.innerHTML = `
        ${constructHeading(2, i18n)}
        ${constructSummary(term, search.results.length, i18n)}
        <hr />
        ${constructResults(pagedResults, options_.svgs, i18n)}
        ${constructPageLinks(pages, page, options_.svgs, i18n)}
    `;

	return pagedResults;
};

/*
    This is intended for performing a single search on a page.
    However, Pagefind can support more functionality like sorting, filtering,
    debounced search and etc.
*/
const search = async (pagefind, options) => {
	const options_ = {
		itemsPerPage: 6,
		inputSelector: '#search',
		resultsContainer: '#results-container',
		resultsSelector: '#search-results',
		cloak: 'cloak',
		queryParam: 'q',
		pageParam: 'page',
		...options,
	};

	const parameters = new URLSearchParams(globalThis.location.search);
	let term = parameters.get(options_.queryParam);

	const searchInput = document.querySelector(options_.inputSelector);
	searchInput.value = term;

	let page = parameters.get(options_.pageParam);
	page = Number.isNaN(page) ? 1 : Number(page ?? 1);

	term = typeof term === 'string' ? term.trim() : '';

	if (!term) {
		return [];
	}

	const search = await pagefind.search(term);
	const results = await render(search, term, page, options_);

	if (options_.cloak) {
		document.querySelector(options_.resultsContainer).classList.remove(options_.cloak);
	}

	return results;
};

globalThis.search = search;
