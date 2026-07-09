/**
 * Extract content of a specific heading
 * @param {string} content - raw content of markdown
 * @param {string} heading - heading of the section
 * @returns {string} - content of the heading
 */
export default function extractHeadingSection(content, heading) {
	const filter = new RegExp(
		String.raw`#{1,6}\s+${heading}.*\r?\n([\s\S]*?)(?=\r?\n#{1,6}\s|$)`,
		'iv',
	);
	const match = content.match(filter);
	return match ? match[1].trim() : '';
}
