import assert from 'node:assert';
import test from 'node:test';
import extractHeadingSection from '../src/assets/scripts/extract-heading-section.js';

const testRawMarkdown = `
## heading1

content of heading 1

## heading2

content of heading 2`;

test('get first heading content', () => {
	assert.equal(extractHeadingSection(testRawMarkdown, 'heading1'), 'content of heading 1');
});

test('get second heading content', () => {
	assert.equal(extractHeadingSection(testRawMarkdown, 'heading2'), 'content of heading 2');
});
