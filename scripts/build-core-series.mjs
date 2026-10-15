// Builds the Core Report explorer's data from sdsc-data outputs, into
// src/routes/lib/data/coredata/:
//
//   coreCities.csv    one row per downtown: key, display name, province, its
//                     CMA/CA, areas for density, and the census years whose
//                     downtown figures are usable
//   coreVariables.csv one row per census variable: theme, indicator, name, and
//                     whether it is read as a share of its indicator or a value
//   coreSeries.csv    one row per downtown and variable: the downtown (dt) and
//                     region (cma) figure in each census year
//
// Every downtown and census year in the source is kept, so new downtowns and
// census years flow through to the explorer on re-run.
//
// Usage:
//   npm run core-series                                     # published sources
//   npm run core-series -- ./comparison.csv ./cma.geojson   # or local copies

import { readFile, writeFile } from 'node:fs/promises';
import { area } from '@turf/turf';
import { csvFormat, csvParse } from 'd3';

const DEFAULT_SOURCE =
	'https://measuringmainstreets.blob.core.windows.net/downtowns/downtown_vs_cma_comparison.csv';
const DEFAULT_CMA_SOURCE =
	'https://raw.githubusercontent.com/canadianurbaninstitute/sdsc-data/main/outputs/spatialfiles/cma_boundaries.geojson';
const DATA_DIR = new URL('../src/routes/lib/data/coredata/', import.meta.url);

// Downtown dwellings almost never fall by a fifth in twenty years, so an
// earlier census with this many more dwellings than the latest one means the
// earlier census's (larger) dissemination areas spilled well past the downtown
// boundary. Those downtown figures are left out rather than shown as decline.
const MAX_DWELLING_RATIO = 1.25;

// Downtown-to-CMA links known to be wrong upstream. The downtown is kept, its
// region figures are dropped until sdsc-data's crosswalk is fixed.
const BAD_CMA_LINKS = {
	Tillsonburg: { province: 'ON', reason: 'linked to the Thetford Mines CA (24430)' }
};

const PROVINCES = {
	10: 'NL',
	11: 'PE',
	12: 'NS',
	13: 'NB',
	24: 'QC',
	35: 'ON',
	46: 'MB',
	47: 'SK',
	48: 'AB',
	59: 'BC',
	60: 'YT',
	61: 'NT',
	62: 'NU'
};

const normalise = (name) =>
	String(name ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z]/g, '');

// "Campbellton (New Brunswick part / partie du Nouveau-Brunswick)" → "Campbellton",
// "Greater Sudbury / Grand Sudbury" → "Greater Sudbury".
const shortName = (name) =>
	String(name)
		.replace(/\s*\(.*\)\s*$/, '')
		.replace(/\s*\/.*$/, '')
		.trim();

// sdsc-data downtown names lose punctuation ("Fort_St__John", "Val_d_Or");
// when the downtown shares its CMA/CA's name, the CMA name keeps it intact.
const displayName = (downtown, cma) =>
	shortName(normalise(downtown) === normalise(cma) ? cma : downtown.replace(/_+/g, ' '));

function round(raw, digits) {
	if (raw == null || raw === '' || raw === 'NA') return '';
	const value = Number(raw);
	return Number.isFinite(value) ? String(Number(value.toFixed(digits))) : '';
}

async function readSource(source) {
	if (!/^https?:/.test(source)) return readFile(source, 'utf8');
	const res = await fetch(source);
	if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
	return res.text();
}

const rows = csvParse((await readSource(process.argv[2] ?? DEFAULT_SOURCE)).replace(/^﻿/, ''));
const years = rows.columns
	.map((column) => Number(column.match(/^value_(\d{4})_dt$/)?.[1]))
	.filter(Boolean)
	.sort((a, b) => a - b);
const latest = years.at(-1);

// Downtowns, in source order.
const cities = new Map();
for (const row of rows) {
	if (cities.has(row.DTNAME)) continue;
	const bad = BAD_CMA_LINKS[row.DTNAME];
	const name = displayName(row.DTNAME, row.CMANAME);
	cities.set(row.DTNAME, {
		key: normalise(name),
		name,
		province: bad?.province ?? PROVINCES[String(row.CMAPUID).slice(0, 2)] ?? '',
		cma_key: bad ? '' : row.CMAPUID,
		cma_name: bad ? '' : shortName(row.CMANAME)
	});
}
const keys = [...cities.values()].map((c) => c.key);
const duplicate = keys.find((key, i) => keys.indexOf(key) !== i);
if (duplicate) throw new Error(`Two downtowns share the key "${duplicate}"`);

// Census years whose downtown figures are usable (see MAX_DWELLING_RATIO).
for (const row of rows) {
	if (row.variable_name !== 'Dwellings') continue;
	const city = cities.get(row.DTNAME);
	const latestDwellings = Number(row[`value_${latest}_dt`]);
	city.dt_years = years
		.filter((year) => {
			if (year === latest) return true;
			const dwellings = Number(row[`value_${year}_dt`]);
			return dwellings > 0 && dwellings <= latestDwellings * MAX_DWELLING_RATIO;
		})
		.join(' ');
}

// Census variables, in sheet order. "Total …" rows are denominators the
// explorer never plots. A variable with any share is read as a share.
const variables = new Map();
for (const row of rows) {
	if (/^total\b/i.test(row.variable_name)) continue;
	const id = `${row.indicator}|${row.variable_name}`;
	if (!variables.has(id)) {
		variables.set(id, {
			id: String(variables.size + 1),
			theme: row.theme,
			indicator: row.indicator,
			variable_name: row.variable_name,
			field: 'value'
		});
	}
	const hasShare = years.some((y) =>
		['dt', 'cma'].some((geo) => round(row[`percent_${y}_${geo}`], 2) !== '')
	);
	if (hasShare) variables.get(id).field = 'percent';
}

const series = [];
for (const row of rows) {
	const variable = variables.get(`${row.indicator}|${row.variable_name}`);
	if (!variable) continue;
	const city = cities.get(row.DTNAME);
	const usable = city.dt_years.split(' ').map(Number);
	const digits = variable.field === 'percent' ? 2 : 0;
	const out = { city: city.key, variable: variable.id };
	for (const year of years) {
		out[`v_${year}_dt`] = usable.includes(year)
			? round(row[`${variable.field}_${year}_dt`], digits)
			: '';
		out[`v_${year}_cma`] = city.cma_key ? round(row[`${variable.field}_${year}_cma`], digits) : '';
	}
	series.push(out);
}

// Areas for density. Downtown boundaries are fixed across censuses, so one
// area serves every year; measured geodesically from the WGS84 boundaries
// (not every downtown has one yet). CMA land areas are Statistics Canada's for
// the boundary year the file was drawn for (its DGUID starts with that year).
const boundaries = JSON.parse(await readFile(new URL('downtownBoundaries.json', DATA_DIR), 'utf8'));
const cmas = JSON.parse(await readSource(process.argv[3] ?? DEFAULT_CMA_SOURCE));
const cmaByUid = new Map(cmas.features.map((f) => [String(f.properties.CMAPUID), f.properties]));

const cityRows = [...cities.values()].map((city) => {
	const boundary = boundaries.features.find((f) => f.properties.key === city.key);
	const cma = cmaByUid.get(String(city.cma_key));
	return {
		...city,
		downtown_km2: boundary ? (area(boundary) / 1e6).toFixed(3) : '',
		cma_km2: cma?.LANDAREA ?? '',
		cma_area_year: cma?.DGUID?.slice(0, 4) ?? ''
	};
});

await writeFile(new URL('coreCities.csv', DATA_DIR), csvFormat(cityRows) + '\n');
await writeFile(new URL('coreVariables.csv', DATA_DIR), csvFormat([...variables.values()]) + '\n');
await writeFile(new URL('coreSeries.csv', DATA_DIR), csvFormat(series) + '\n');

const partial = cityRows.filter((c) => c.dt_years !== years.join(' '));
const regions = new Set(cityRows.map((c) => c.cma_key).filter(Boolean));
console.log(
	`${cityRows.length} downtowns, ${regions.size} regions, ${variables.size} variables, census years ${years.join(', ')}`
);
console.log(
	`Downtown figures left out for an earlier census (boundary mismatch): ${partial.length} downtowns`
);
console.log(
	`Areas: ${cityRows.filter((c) => c.downtown_km2).length} downtowns, ${new Set(cityRows.filter((c) => c.cma_km2).map((c) => c.cma_key)).size} regions`
);
for (const [name, { reason }] of Object.entries(BAD_CMA_LINKS)) {
	console.warn(`Region dropped for ${name}: ${reason}`);
}
