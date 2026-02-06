const menuButton = document.querySelector('#navigation-toggle');
menuButton.addEventListener('click', () => {
	const ariaExpanded = menuButton.ariaExpanded === 'false';
	menuButton.ariaExpanded = ariaExpanded;
});

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
