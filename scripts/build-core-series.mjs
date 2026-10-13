// Trims sdsc-data's downtown_vs_cma_comparison.csv (every downtown in Canada,
// ~3.6 MB) down to the downtowns the Core Report explorer profiles, and writes
// src/routes/lib/data/coredata/coreSeries.csv for the "change" module.
//
// Usage:
//   npm run core-series                 # reads the published CSV from Azure
//   npm run core-series -- ./local.csv  # or a local copy
//
// Every census year present in the source (value_<year>_dt columns) is kept,
// so new census years flow through to the explorer's date range on re-run.

import { readFile, writeFile } from 'node:fs/promises';
import { csvFormat, csvParse } from 'd3';
import { CORE_CITIES as CITIES } from '../src/routes/lib/data/coredata/coreCities.js';

const DEFAULT_SOURCE =
	'https://measuringmainstreets.blob.core.windows.net/downtowns/downtown_vs_cma_comparison.csv';
const OUTPUT = new URL('../src/routes/lib/data/coredata/coreSeries.csv', import.meta.url);

// sdsc-data downtown names don't match the explorer's keys exactly
// ("Montréal", "St. John's", "Fort_St__John"), so compare letters only.
const normalise = (name) =>
	String(name ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z]/g, '');

const cityByName = new Map();
for (const city of CITIES) {
	cityByName.set(normalise(city.key), city.key);
	cityByName.set(normalise(city.name), city.key);
}

// R writes missing values as "NA"; keep them empty rather than zero.
function round(raw, digits) {
	if (raw == null || raw === '' || raw === 'NA') return '';
	const value = Number(raw);
	return Number.isFinite(value) ? String(Number(value.toFixed(digits))) : '';
}

const source = process.argv[2] ?? DEFAULT_SOURCE;
const text = /^https?:/.test(source)
	? await fetch(source).then((res) => {
			if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
			return res.text();
		})
	: await readFile(source, 'utf8');

const rows = csvParse(text.replace(/^﻿/, ''));
const years = rows.columns
	.map((column) => column.match(/^value_(\d{4})_dt$/)?.[1])
	.filter(Boolean)
	.sort();

const columns = ['city', 'theme', 'indicator', 'variable_name'];
for (const year of years) {
	columns.push(
		`value_${year}_dt`,
		`percent_${year}_dt`,
		`value_${year}_cma`,
		`percent_${year}_cma`
	);
}

const kept = [];
const matched = new Set();
for (const row of rows) {
	const city = cityByName.get(normalise(row.DTNAME));
	if (!city) continue;
	matched.add(city);
	const out = {
		city,
		theme: row.theme,
		indicator: row.indicator,
		variable_name: row.variable_name
	};
	for (const year of years) {
		for (const geo of ['dt', 'cma']) {
			out[`value_${year}_${geo}`] = round(row[`value_${year}_${geo}`], 0);
			out[`percent_${year}_${geo}`] = round(row[`percent_${year}_${geo}`], 2);
		}
	}
	kept.push(out);
}

await writeFile(OUTPUT, csvFormat(kept, columns) + '\n');

const missing = CITIES.filter((c) => !matched.has(c.key)).map((c) => c.name);
console.log(
	`coreSeries.csv: ${kept.length} rows, ${matched.size} downtowns, census years ${years.join(', ')}`
);
if (missing.length) console.warn(`No match in the source for: ${missing.join(', ')}`);
