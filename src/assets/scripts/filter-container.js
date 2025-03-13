class FilterContainer extends HTMLElement {
    constructor() {
        super();
        this.attrs = {
            oninit: "oninit",
            valueDelimiter: "delimiter",
            leaveUrlAlone: "leave-url-alone",
            mode: "filter-mode",
            bind: "data-filter-key",
            results: "data-filter-results",
            resultsExclude: "data-filter-results-exclude",
            paginateResults: "data-paginate-results",
            paginationResults: "data-pagination-results",
            paginationNavigation: "data-pagination-navigation",
            paginationLink: "data-pagination-link",
            applyButton: "data-apply-button"
        };
        this.classes = {
            enhanced: "filter-container--js",
            hidden: "filter--hide"
        };
    }

    connectedCallback() {
        this.init();
    }

    init() {
        this._lookedFor = {};

        this.classList.add(this.classes.enhanced);

        if (this.getAttribute(this.attrs.paginateResults) || false) {
            this.dataset.page = 1;
        }

        this.bindEvents(this.formElements);

        if (this.hasAttribute(this.attrs.oninit)) {
            // This timeout was necessary to fix a bug with Google Chrome 93
            // Navigate to a filterable page, navigate away, use the back button to return
            // (connectedCallback would filter before the DOM was ready)
            window.setTimeout(() => {
                this.initPagination();

                for (let key in this.formElements) {
                    this.initFormElements(this.formElements[key]);
                    this.applyFilterForKey(key);
                    this.renderResultCount(true);
                }

                this.renderPaginationNavigation(true);
            }, 0);
        }
    }

    get valueDelimiter() {
        if (!this._valueDelimiter) {
            this._valueDelimiter = this.getAttribute(this.attrs.valueDelimiter) || ",";
        }

        return this._valueDelimiter;
    }

    get applyButton() {
        if (!this._applyButton) {
            this._applyButton = this.getAttribute(this.attrs.applyButton) || false;
        }

        return this._applyButton;
    }

    get formElements() {
        if (!this._lookedFor.formElements) {
            let selector = `:scope [${this.attrs.bind}]`;
            let results = {};
            for (let node of this.querySelectorAll(selector)) {
                let attr = node.getAttribute(this.attrs.bind);
                if (!results[attr]) {
                    results[attr] = [];
                }
                results[attr].push(node);
            }
            this._formElements = results;
            this._lookedFor.formElements = true;
        }

        return this._formElements;
    }

    getAllKeys() {
        return Object.keys(this.formElements);
    }

    getElementSelector(key) {
        return `data-filter-${key}`;
    }

    getKeyFromAttributeName(attributeName) {
        return attributeName.substr("data-filter-".length);
    }

    getFilterMode(key) {
        if (!this.modes) {
            this.modes = {};
        }
        if (!this.modes[key]) {
            this.modes[key] = this.getAttribute(`${this.attrs.mode}-${key}`);
        }
        if (!this.modes[key]) {
            if (!this.globalMode) {
                this.globalMode = this.getAttribute(this.attrs.mode);
            }
            return this.globalMode;
        }

        return this.modes[key];
    }

    getFuzzy(key) {
        return this.hasAttribute(`filter-fuzzy-${key}`);
    }

    bindEvents() {
        this.addEventListener(
            "input",
            (e) => {
                if (this.attrs.applyButton && this.querySelector("#" + this.applyButton)) {
                    return false;
                }
                let closest = e.target.closest(`[${this.attrs.bind}]`);
                if (closest) {
                    this.applyFilterForElement(closest);
                    requestAnimationFrame(() => {
                        this.renderResultCount();
                        this.renderPaginationNavigation();
                    });
                }
            },
            false
        );

        this.addEventListener(
            "click",
            (e) => {
                if (this.attrs.applyButton && e.target.tagName === "BUTTON" && e.target.id === this.applyButton) {
                    for (let key in this.formElements) {
                        this.applyFilterForKey(key);
                        this.renderResultCount(true);
                    }

                    this.renderPaginationNavigation();
                }

                if ((e.target.tagName === "A" && e.target.closest(`[${this.attrs.paginationNavigation}]`)) || e.target.closest(`[${this.attrs.paginationNavigation}] a`)) {
                    e.preventDefault();

                    let pageCount = this.getPageCount();
                    let currentPage = parseInt(this.dataset.page);
                    let newPage;
                    let prevLink = this.querySelector(`[${this.attrs.paginationNavigation}] [rel="prev"]`);
                    let nextLink = this.querySelector(`[${this.attrs.paginationNavigation}] [rel="next"]`);

                    if (e.target.closest("a").getAttribute("rel")) {
                        if (e.target.closest("a").getAttribute("rel") === "prev") {
                            if (currentPage > 1) {
                                newPage = currentPage - 1;
                            }
                        }

                        if (e.target.closest("a").getAttribute("rel") === "next") {
                            if (currentPage < pageCount) {
                                newPage = currentPage + 1;
                            }
                        }
                    }

                    if (e.target.closest("a").dataset.page) {
                        newPage = parseInt(e.target.closest("a").dataset.page);
                    }

                    this.dataset.page = newPage;

                    this.applyPagination(newPage);

                    prevLink.href = this.generatePaginationUrl(newPage - 1);
                    nextLink.href = this.generatePaginationUrl(newPage + 1);

                    if (newPage === 1) {
                        if (prevLink.parentElement.tagName === "LI") {
                            prevLink.parentElement.setAttribute("hidden", true);
                        } else {
                            prevLink.setAttribute("hidden", true);
                        }
                        prevLink.href = "#";
                    }

                    if (newPage > 1) {
                        if (prevLink.parentElement.tagName === "LI") {
                            prevLink.parentElement.removeAttribute("hidden");
                        } else {
                            prevLink.removeAttribute("hidden");
                        }
                    }

                    if (newPage === pageCount) {
                        if (nextLink.parentElement.tagName === "LI") {
                            nextLink.parentElement.setAttribute("hidden", true);
                        } else {
                            nextLink.setAttribute("hidden", true);
                        }
                        nextLink.href = "#";
                    }

                    if (newPage < pageCount) {
                        if (nextLink.parentElement.tagName === "LI") {
                            nextLink.parentElement.removeAttribute("hidden");
                        } else {
                            nextLink.removeAttribute("hidden");
                        }
                    }

                    this.querySelector(`[${this.attrs.paginationNavigation}] [aria-current="page"]`)?.removeAttribute("aria-current");
                    this.querySelector(`[${this.attrs.paginationNavigation}] [data-page="${newPage}"]`)?.setAttribute("aria-current", "page");
                    this.renderResultCount();

                    if (!this.hasAttribute(this.attrs.leaveUrlAlone)) {
                        this.updateUrl("page", [newPage]);
                    }
                }

                return false;
            },
            false
        );
    }

    initFormElements(formElements) {
        for (let el of formElements) {
            let urlParamValues = this.getUrlFilterValues(el);
            for (let value of urlParamValues) {
                let type = el.getAttribute("type");
                if (el.tagName === "INPUT" && (type === "checkbox" || type === "radio")) {
                    if (el.value === value) {
                        el.checked = true;
                    }
                } else {
                    el.value = value;
                }
            }
        }
    }

    initPagination() {
        if (!this.paginationNavigation) {
            return false;
        }

        let params = new URLSearchParams(this.getUrlSearchValue());
        let currentPage = parseInt(params.get("page")) || 1;
        let pageCount = this.getPageCount();
        this.dataset.page = currentPage > pageCount ? pageCount : currentPage;
    }

    getFormElementKey(formElement) {
        return formElement.getAttribute(this.attrs.bind);
    }

    _getMap(key) {
        let values = [];
        for (let formElement of this.formElements[key]) {
            let type = formElement.getAttribute("type");
            if (formElement.tagName === "INPUT" && (type === "checkbox" || type === "radio")) {
                if (formElement.checked) {
                    values.push(formElement.value);
                }
            } else {
                values.push(formElement.value);
            }
        }

        if (!this.hasAttribute(this.attrs.leaveUrlAlone)) {
            this.updateUrl(key, values);
        }

        let elementsSelectorAttr = this.getElementSelector(key);
        let selector = `:scope [${elementsSelectorAttr}]`;
        let elements = this.querySelectorAll(selector);

        let map = new Map();
        for (let element of Array.from(elements)) {
            let isValid = this.elementIsValid(element, elementsSelectorAttr, values);
            map.set(element, isValid);
        }
        return map;
    }

    _applyMapForKey(key, map) {
        if (!key) {
            return;
        }

        for (let [element, isVisible] of map) {
            let cls = `filter-${key}--hide`;
            if (isVisible) {
                element.classList.remove(cls);
            } else {
                element.classList.add(cls);
            }
        }

        if (this.getAttribute(this.attrs.paginateResults) || false) {
            this.applyPagination();
        }
    }

    applyFilterForElement(formElement) {
        let key = this.getFormElementKey(formElement);
        this.applyFilterForKey(key);
    }

    applyFilterForKey(key) {
        let firstFormElementForDelimiter = this.formElements[key][0];
        if (!firstFormElementForDelimiter) {
            return;
        }
        let map = this._getMap(key);
        this._applyMapForKey(key, map);
    }

    applyPagination(currentPage) {
        if (!this.paginationNavigation) {
            return false;
        }

        let keys = this.getAllKeys();
        let selector = keys
            .map((key) => {
                return `:scope [${this.getElementSelector(key)}]`;
            })
            .join(",");
        let elements = this.querySelectorAll(selector);

        let paginationSize = this.getAttribute(this.attrs.paginateResults) || false;

        if (elements.length) {
            if (!currentPage) {
                let pageCount = this.dataset.pages;
                currentPage = parseInt(this.dataset.page) < pageCount ? parseInt(this.dataset.page) : 1;
            }

            let i = 1;
            let paginationCls = `pagination--hide`;

            elements.forEach((element) => {
                if (this.elementIsVisible(element)) {
                    if (Math.ceil(i / paginationSize) !== currentPage) {
                        element.classList.add(paginationCls);
                    } else {
                        element.classList.remove(paginationCls);
                    }

                    i++;
                } else {
                    element.removeAttribute("data-page");
                }
            });
        }
    }

    _hasValue(needle, haystack = [], mode = "any", fuzzy = false) {
        if (!haystack || !haystack.length || !Array.isArray(haystack)) {
            return false;
        }

        if (!Array.isArray(needle)) {
            needle = [needle];
        }

        // all must match
        if (mode === "all") {
            let found = true;
            if (fuzzy) {
                for (let lookingFor of haystack) {
                    if (!needle.some((val) => val.toLowerCase().includes(lookingFor.toLowerCase()))) {
                        found = false;
                    }
                }
            } else {
                for (let lookingFor of haystack) {
                    if (!needle.some((val) => val === lookingFor)) {
                        found = false;
                    }
                }
            }
            return found;
        }

        for (let lookingFor of needle) {
            // has any, return true
            if (fuzzy) {
                if (haystack.some((val) => val.toLowerCase().includes(lookingFor.toLowerCase()))) {
                    return true;
                }
            } else {
                if (haystack.some((val) => val === lookingFor)) {
                    return true;
                }
            }
        }
        return false;
    }

    elementIsValid(element, attributeName, values) {
        let hasAttr = element.hasAttribute(attributeName);
        if (hasAttr && (!values.length || !values.join(""))) {
            // [] or [''] for value="" radio
            return true;
        }
        let haystack = (element.getAttribute(attributeName) || "").split(this.valueDelimiter);
        let key = this.getKeyFromAttributeName(attributeName);
        let mode = this.getFilterMode(key);
        let fuzzy = this.getFuzzy(key);
        if (hasAttr && this._hasValue(haystack, values, mode, fuzzy)) {
            return true;
        }
        return false;
    }

    /*
     * Feature: Result count
     */

    get resultsCounter() {
        if (!this._lookedFor.resultsCounter) {
            this._results = this.querySelector(`:scope [${this.attrs.results}]`);
            this._lookedFor.resultsCounter = true;
        }

        return this._results;
    }

    getGlobalCount() {
        let keys = this.getAllKeys();
        let selector = keys
            .map((key) => {
                return `:scope [${this.getElementSelector(key)}]`;
            })
            .join(",");
        let elements = this.querySelectorAll(selector);

        return Array.from(elements)
            .filter((entry) => this.elementIsVisible(entry))
            .filter((entry) => !this.elementIsExcluded(entry)).length;
    }

    getPageCount() {
        if (!this.paginationNavigation) {
            return false;
        }

        let paginationSize = this.getAttribute(this.attrs.paginateResults) || false;

        if (paginationSize) {
            let keys = this.getAllKeys();
            let selector = keys
                .map((key) => {
                    return `:scope [${this.getElementSelector(key)}]`;
                })
                .join(",");
            let elements = this.querySelectorAll(selector);

            return Math.ceil(
                Array.from(elements)
                    .filter((entry) => this.elementIsVisible(entry))
                    .filter((entry) => !this.elementIsExcluded(entry)).length / paginationSize
            );
        }

        return false;
    }

    /**
     * Paginator
     */

    get paginationResults() {
        if (!this._lookedFor.paginationResults) {
            this._paginationResults = this.querySelector(`:scope [${this.attrs.paginationResults}]`);
            this._lookedFor.paginationResults = true;
        }

        return this._paginationResults;
    }

    get paginationNavigation() {
        if (!this._lookedFor.paginationNavigation) {
            this._paginationNavigation = this.querySelector(`:scope [${this.attrs.paginationNavigation}]`);
            this._paginationLink = this.querySelector(`:scope [${this.attrs.paginationNavigation}] [${this.attrs.paginationLink}]`);
            this._previousLink = this.querySelector(`:scope [${this.attrs.paginationNavigation}] [rel="prev"]`);
            this._nextLink = this.querySelector(`:scope [${this.attrs.paginationNavigation}] [rel="next"]`);
            this._lookedFor.paginationNavigation = true;
        }

        // Pagination navigation requires a container with a pagination link template as well as previous and next links.
        if (!this._paginationNavigation || !this._paginationLink || !this._previousLink || !this._nextLink) {
            return false;
        }

        return this._paginationNavigation;
    }

    _renderPaginationNavigation() {
        if (!this.paginationNavigation) {
            return;
        }

        [...this.paginationNavigation.querySelectorAll("[data-page]")].forEach((link) => {
            if (link.parentElement.tagName === "LI") {
                link.parentElement.remove();
            } else {
                link.remove();
            }
        });

        let prev = this.paginationNavigation.querySelector('[rel="prev"]').parentElement.tagName === "LI" ? this.paginationNavigation.querySelector('[rel="prev"]').parentElement : this.paginationNavigation.querySelector('[rel="prev"]');

        let next = this.paginationNavigation.querySelector('[rel="next"]').parentElement.tagName === "LI" ? this.paginationNavigation.querySelector('[rel="next"]').parentElement : this.paginationNavigation.querySelector('[rel="next"]');

        let count = this.getPageCount();

        if (count <= 1) {
            this.paginationNavigation.hidden = true;
        } else {
            this.paginationNavigation.removeAttribute("hidden");
        }

        let current = parseInt(this.dataset.page);

        if (current === 1) {
            prev.setAttribute("hidden", true);
        }

        if (current > count) {
            current = 1;
            if (!this.hasAttribute(this.attrs.leaveUrlAlone)) {
                this.updateUrl("page", [1]);
            }
        }

        let template = this.querySelector(`:scope [${this.attrs.paginationLink}]`);

        let i = 1;

        while (i <= count) {
            if (!this.paginationNavigation.querySelector(`a[data-page="${i}"]`)) {
                let clone = template.content.cloneNode(true);
                let linkParent;
                let link = clone.querySelector("a");
                if (link.parentElement) {
                    linkParent = link.parentElement;
                }

                link.dataset.page = i;
                link.setAttribute("href", this.generatePaginationUrl(i));
                link.innerText = i;

                if (i === current) {
                    link.setAttribute("aria-current", "page");
                }

                if (linkParent) {
                    linkParent.appendChild(link);

                    next.before(linkParent);
                } else {
                    next.before(link);
                }
            }

            i++;
        }
    }

    renderPaginationNavigation() {
        if (!this.paginationNavigation) {
            return;
        }

        this._renderPaginationNavigation();
    }

    elementIsVisible(element) {
        for (let cls of element.classList) {
            if (cls.startsWith("filter-") && cls.endsWith("--hide")) {
                return false;
            }
        }
        return true;
    }

    elementIsExcluded(element) {
        return element.hasAttribute(this.attrs.resultsExclude);
    }

    getLabels() {
        if (this.resultsCounter) {
            let attrValue = this.resultsCounter.getAttribute(this.attrs.results);
            let split = attrValue.split("/");
            if (split.length === 2) {
                return split;
            }
        }
        return ["Result", "Results"];
    }

    _renderResultCount(count) {
        if (!this.resultsCounter) {
            return;
        }
        if (!count) {
            count = this.getGlobalCount();
        }

        let labels = this.getLabels();
        this.resultsCounter.innerText = `${count} ${count !== 1 ? labels[1] : labels[0]}`;
    }

    renderResultCount(isOnload = false) {
        if (!this.resultsCounter) {
            return;
        }

        if (!isOnload && this.resultsCounter.hasAttribute("aria-live")) {
            // This timeout helped VoiceOver
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this._renderResultCount();
                this._renderPaginationResults();
            }, 250);
        } else {
            this._renderResultCount();
            this._renderPaginationResults();
        }
    }

    _renderPaginationResults(current) {
        if (!this.paginationResults) {
            return;
        }

        if (!current) {
            current = parseInt(this.dataset.page);
        }

        let label = this.paginationResults.getAttribute(this.attrs.paginationResults) || "page";
        this.paginationResults.innerText = this.getPageCount() > 0 ? `${label} ${current}` : "";
    }

    /*
     * Feature: Work with URLs
     */

    getUrlSearchValue() {
        let s = window.location.search;
        if (s.startsWith("?")) {
            return s.substr(1);
        }
        return s;
    }

    getUrlFilterValues(formElement) {
        let params = new URLSearchParams(this.getUrlSearchValue());
        let key = this.getFormElementKey(formElement);
        return params.getAll(key);
    }

    // Future improvement: url updates currently once per key (we could group these into one)
    updateUrl(key, values) {
        let params = new URLSearchParams(this.getUrlSearchValue());
        let keyParamsStr = params.getAll(key).sort().join(",");
        let valuesStr = values.slice().sort().join(",");

        if (keyParamsStr !== valuesStr) {
            params.delete(key);
            for (let value of values) {
                if (value) {
                    // ignore ""
                    params.append(key, value);
                }
            }

            let baseUrl = window.location.pathname;
            let newUrl = `${baseUrl}${params.toString().length > 0 ? `?${params}` : ""}`;
            history.replaceState({}, "", newUrl);
        }
    }

    generatePaginationUrl(page) {
        let params = new URLSearchParams(this.getUrlSearchValue());

        params.set("page", page);

        return `${window.location.pathname}${params.toString().length > 0 ? `?${params}` : ""}`;
    }
}

if ("customElements" in window) {
    window.customElements.define("filter-container", FilterContainer);
}
