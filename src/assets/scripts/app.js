const menuButton = document.querySelector('#navigation-toggle');
menuButton.addEventListener('click', () => {
	const ariaExpanded = menuButton.ariaExpanded === 'false';
	menuButton.ariaExpanded = ariaExpanded;
});

/**
 * @param {string} function_ The function to be called when the document is ready.
 */
function documentReady(function_) {
	// See if DOM is already available
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		// Call on next available tick
		setTimeout(function_, 1);
	} else {
		document.addEventListener('DOMContentLoaded', function_);
	}
}

/**
 * Handle a URL hash or hash change.
 * @param {string} hash The hash to focus.
 */
function handleHash(hash) {
	const target = document.querySelector(hash);

	target.setAttribute('tabindex', -1);
	target.focus();
	target.addEventListener('blur', event => event.target.removeAttribute('tabindex'));
	target.addEventListener('focusout', event => event.target.removeAttribute('tabindex'));
}

documentReady(() => {
	if (document.location.hash) {
		const escapedHash = document.location.hash.replace(':', String.raw`\:`);
		handleHash(escapedHash);
	}

	globalThis.addEventListener('hashchange', event => {
		const escapedHash = new URL(event.newURL).hash.replace(':', String.raw`\:`);
		handleHash(escapedHash, true);
	});

	globalThis.addEventListener('click', event => {
		const currentBacklink = document.querySelector('[role="doc-backlink"][aria-current="true"]');

		if (currentBacklink) {
			currentBacklink.removeAttribute('aria-current');
		}

		if (event.target.getAttribute('role') === 'doc-noteref') {
			const backlink = document.querySelector(`[role="doc-backlink"][href$="#${event.target.id}"]`);
			backlink.setAttribute('aria-current', 'true');
		}
	});

	const currentHostName = globalThis.location.hostname;
	const links = document.querySelectorAll('a[href]');

	for (const link of links) {
		if (link.hostname !== currentHostName && !link.rel) {
			link.rel = 'external';
		}
	}
});

document.addEventListener('click', event => {
	if (event.target.closest('.navigation__button')) {
		const button = event.target.closest('.navigation__button');
		const ariaExpanded = button.getAttribute('aria-expanded') === 'true' || false;
		button.setAttribute('aria-expanded', !ariaExpanded);
	}

	if (!event.target.closest('[data-dropdown]')) {
		const buttons = document.querySelectorAll('.navigation__button');
		for (const button of buttons) {
			button.setAttribute('aria-expanded', false);
		}
	}
});

document.addEventListener('keyup', event => {
	if (event.key === 'Escape') {
		const buttons = document.querySelectorAll('.navigation__button');
		for (const button of buttons) {
			button.setAttribute('aria-expanded', false);
		}
	}
});

const handleDisclosureBlur = event => {
	const dropdown = event.target.closest('[data-dropdown]');
	const button = dropdown.querySelector('.navigation__button');
	if (!event.relatedTarget.closest('[data-dropdown]')) {
		button.setAttribute('aria-expanded', false);
	}
};

const menuButtons = document.querySelectorAll('.navigation__button');

for (const button of menuButtons) {
	button.addEventListener('blur', event => handleDisclosureBlur(event));
}

const menuItems = document.querySelectorAll('[data-dropdown] a');

for (const menuItem of menuItems) {
	menuItem.addEventListener('blur', event => handleDisclosureBlur(event));
}

/**
 * Based on code by Chris Ferdinandi, released under the MIT license.
 * @see https://gomakethings.com/web-components-vs.-state-based-ui/
 */

customElements.define(
	'inclusive-disclosure',
	class extends HTMLElement {
		constructor() {
			super();

			this.toggle = this.querySelector('[aria-controls]');

			if (!this.toggle) {
				return;
			}

			this.toggle.removeAttribute('hidden');
			this.toggle.setAttribute('aria-expanded', false);
			this.toggle.addEventListener('click', this);
		}

		handleEvent(event) {
			event.preventDefault();
			if (this.toggle.getAttribute('aria-expanded') === 'true') {
				this.toggle.setAttribute('aria-expanded', false);
			} else {
				this.toggle.setAttribute('aria-expanded', true);
			}
		}
	},
);
