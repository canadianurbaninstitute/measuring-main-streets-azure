// Builds the Core Report explorer's data from sdsc-data outputs:
//
//   coreSeries.csv - downtown_vs_cma_comparison.csv (every downtown in Canada,
//                    ~3.6 MB) trimmed to the downtowns the explorer profiles.
//                    Every census year in the source is kept, so new census
//                    years flow through to the date range on re-run.
//   coreAreas.csv  - area of each downtown (measured from
//                    downtownBoundaries.json) and Statistics Canada's land
//                    area for its CMA (from sdsc-data's cma_boundaries.geojson),
//                    the denominators for density.
//
// Usage:
//   npm run core-series                                # published sources
//   npm run core-series -- ./comparison.csv ./cma.geojson   # or local copies

import { readFile, writeFile } from 'node:fs/promises';
import { area } from '@turf/turf';
import { csvFormat, csvParse } from 'd3';
import { CORE_CITIES as CITIES } from '../src/routes/lib/data/coredata/coreCities.js';

const DEFAULT_SOURCE =
	'https://measuringmainstreets.blob.core.windows.net/downtowns/downtown_vs_cma_comparison.csv';
const DEFAULT_CMA_SOURCE =
	'https://raw.githubusercontent.com/canadianurbaninstitute/sdsc-data/main/outputs/spatialfiles/cma_boundaries.geojson';
const DATA_DIR = new URL('../src/routes/lib/data/coredata/', import.meta.url);
const OUTPUT = new URL('coreSeries.csv', DATA_DIR);
const AREAS_OUTPUT = new URL('coreAreas.csv', DATA_DIR);

async function readSource(source) {
	if (!/^https?:/.test(source)) return readFile(source, 'utf8');
	const res = await fetch(source);
	if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
	return res.text();
}

// sdsc-data downtown names don't match the explorer's keys exactly
// ("Montréal", "St. John's", "Fort_St__John"), so compare letters only.
const normalise = (name) =>
	String(name ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
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

const text = await readSource(process.argv[2] ?? DEFAULT_SOURCE);

const rows = csvParse(text.replace(/^\uFEFF/, ''));
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
const cmaOf = new Map();
for (const row of rows) {
	const city = cityByName.get(normalise(row.DTNAME));
	if (!city) continue;
	matched.add(city);
	cmaOf.set(city, row.CMAPUID);
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

// Areas. Downtown boundaries are fixed across censuses, so one area serves
// every year; measured geodesically from the WGS84 boundaries. CMA land areas
// are Statistics Canada's, for the boundary year the file was drawn for
// (its DGUID starts with that year), and apply to that census only.
const boundaries = JSON.parse(await readFile(new URL('downtownBoundaries.json', DATA_DIR), 'utf8'));
const cmas = JSON.parse(await readSource(process.argv[3] ?? DEFAULT_CMA_SOURCE));
const cmaByUid = new Map(cmas.features.map((f) => [String(f.properties.CMAPUID), f.properties]));

const areas = CITIES.map(({ key }) => {
	const boundary = boundaries.features.find((f) => f.properties.key === key);
	const cma = cmaByUid.get(String(cmaOf.get(key)));
	return {
		city: key,
		downtown_km2: boundary ? (area(boundary) / 1e6).toFixed(3) : '',
		cma_km2: cma?.LANDAREA ?? '',
		cma_year: cma?.DGUID?.slice(0, 4) ?? ''
	};
});
await writeFile(AREAS_OUTPUT, csvFormat(areas) + '\n');

const missing = CITIES.filter((c) => !matched.has(c.key)).map((c) => c.name);
console.log(
	`coreSeries.csv: ${kept.length} rows, ${matched.size} downtowns, census years ${years.join(', ')}`
);
if (missing.length) console.warn(`No match in the source for: ${missing.join(', ')}`);
const noDowntown = areas.filter((a) => !a.downtown_km2).map((a) => a.city);
const noCma = areas.filter((a) => !a.cma_km2).map((a) => a.city);
console.log(
	`coreAreas.csv: ${areas.length - noDowntown.length} downtown, ${areas.length - noCma.length} CMA areas`
);
if (noDowntown.length) console.warn(`No downtown boundary for: ${noDowntown.join(', ')}`);
if (noCma.length) console.warn(`No CMA land area for: ${noCma.join(', ')}`);
