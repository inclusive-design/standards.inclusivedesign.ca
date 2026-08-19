#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { argv, cwd, exit } from 'node:process';

/**
 * Ensure that a supplied string has a leading slash.
 * @param {string} s - A string to check.
 * @returns {string} - The string with a leading slash.
 */
function ensureLeadingSlash(s) {
	if (typeof s !== 'string') {
		return '/';
	}

	return s.startsWith('/') ? s : '/' + s;
}

/**
 * Generate .hurl file.
 */
async function handle() {
	const deploymentUrl = argv[2];
	if (!deploymentUrl) {
		console.error('Usage: node generate-redirects.mjs <DEPLOYMENT_URL>');
		exit(2);
	}

	const inputFile = path.resolve(cwd(), 'src/_data/redirects.json');
	const outputFile = path.resolve(cwd(), 'redirects.hurl');

	let raw;
	try {
		raw = await fs.readFile(inputFile, 'utf8');
	} catch (error) {
		console.error(`Error reading ${inputFile}:`, error.message);
		exit(3);
	}

	let redirects;
	try {
		redirects = JSON.parse(raw);
	} catch (error) {
		console.error(`Error parsing ${inputFile} as JSON:`, error.message);
		exit(4);
	}

	if (redirects === null || typeof redirects !== 'object') {
		console.error(`${inputFile} must contain a JSON object of key -> value path mappings.`);
		exit(5);
	}

	const lines = [];
	for (const [key, value] of Object.entries(redirects)) {
		const k = ensureLeadingSlash(key);
		const v = ensureLeadingSlash(value);
		lines.push(`GET ${deploymentUrl}${k}`, 'HTTP 301', `Location: ${deploymentUrl}${v}`, '', `GET ${deploymentUrl}${v}`, 'HTTP 200', ''); // Blank line between entries
	}

	const output = lines.join('\n').trimEnd() + '\n';
	try {
		await fs.writeFile(outputFile, output, 'utf8');
		console.log(`Wrote ${outputFile} (${Object.keys(redirects).length} entries)`);
	} catch (error) {
		console.error(`Error writing ${outputFile}:`, error.message);
		exit(6);
	}
}

try {
	await handle();
} catch (error) {
	console.error(error);
	exit(1);
}
