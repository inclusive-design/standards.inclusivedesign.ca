import {parseHTML} from 'linkedom';

const parseTransform = (value, outputPath) => {
	if (outputPath && outputPath.includes('.html')) {
		const {document} = parseHTML(value);

		const pageNavHeadings = document.querySelectorAll('main:has(nav) article h2, main:has(nav) article h3');
		const navContainer = document.querySelector('main nav.sidebar-menu #toc ul');
		for (const heading of pageNavHeadings) {
			const link = document.createElement('a');
			link.setAttribute('href', `#${heading.id}`);
			link.innerHTML = heading.textContent;
			const li = document.createElement('li');
			li.append(link);

			if (navContainer && heading.tagName === 'H2') {
				li.dataset.level = '2';
				navContainer.append(li);
			}

			if (navContainer && heading.tagName === 'H3') {
				li.dataset.level = '3';

				/* Retrieve the last list item for an H2 */
				const lastListItem = [...navContainer.querySelectorAll('li[data-level="2"]')].pop();

				/* See if it contains an unordered list for nested H3s */
				let subUl = lastListItem.querySelector('ul');

				/* Add the H3 list item to the unordered list if it exists */
				if (subUl) {
					subUl.append(li);
					/* Create a new unordered list containing the H3 list item and add it to the H2 list item. */
				} else {
					subUl = document.createElement('ul');
					subUl.className = 'flow';
					subUl.append(li);
					lastListItem.append(subUl);
				}
			}
		}

		for (const footnote of document.querySelectorAll('[role="doc-endnote"]')) {
			const backlink = footnote.querySelector('[role="doc-backlink"]');
			const br = document.createElement('br');
			backlink.parentNode.insertBefore(br, backlink);
		}

		const selects = document.querySelectorAll('select:not(.flc-prefsEditor-text-font)');
		if (selects.length > 0) {
			for (const select of selects) {
				const selectContainer = document.createElement('div');
				selectContainer.className = 'select';
				select.parentNode.insertBefore(selectContainer, select);
				selectContainer.append(select);
			}
		}

		return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
	}

	return value;
};

export default parseTransform;
