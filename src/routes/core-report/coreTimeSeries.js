// Census time series for the Core Report explorer: every downtown core and its
// region in the 2001 and 2021 Censuses, read from the sdsc-data output
// `downtown_vs_cma_comparison.csv` (one row per downtown and census variable,
// with downtown `_dt` and CMA `_cma` columns side by side).
//
// The CSV is optional. Drop it into src/routes/lib/data/coredata/ and the
// "change" module appears; without it the module stays hidden. It is loaded
// as its own chunk so it never weighs down the rest of the page.

import { CITIES } from '../lib/data/coredata/coreData.js';

export const SERIES_YEARS = [2001, 2021];

const sources = import.meta.glob('../lib/data/coredata/downtown_vs_cma_comparison.csv');
const loadCsv = Object.values(sources)[0];

/** True when the comparison CSV is present in the build. */
export const SERIES_AVAILABLE = Boolean(loadCsv);

// R's write_csv writes missing values as "NA"; suppressed or absent values
// must stay missing rather than reading as zero.
function num(raw) {
	if (raw == null || raw === '' || raw === 'NA') return null;
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
}

function normalise(name) {
	return String(name ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/\bdowntown\b/g, '')
		.replace(/[^a-z]/g, '');
}

// Downtown names in sdsc-data don't have to match the explorer's city keys
// exactly ("Montreal" vs "Montréal", "St. John's" vs "stjohns").
const cityByName = new Map();
for (const city of CITIES) {
	cityByName.set(normalise(city.key), city);
	cityByName.set(normalise(city.name), city);
}

function slug(text) {
	return normalise(text) || 'unnamed';
}

/**
 * Reshapes the comparison rows into themes → variables, each carrying one
 * entry per downtown in the same shape the beeswarm reads from coreData:
 * `{ key, name, downtown: { 2001, 2021 }, cma: { 2001, 2021 } }`.
 *
 * Shares (percent of the indicator's total) are plotted wherever the pipeline
 * computed one, because they compare fairly as populations grow. Variables
 * without a share (population, dwellings, income) fall back to the raw value.
 * "Total …" rows are denominators and are left out of the picker.
 */
export function buildSeries(rows) {
	const themes = new Map();

	for (const row of rows) {
		const variableName = row.variable_name;
		if (!variableName || /^total\b/i.test(variableName)) continue;

		const themeLabel = row.theme || 'Other';
		if (!themes.has(themeLabel)) {
			themes.set(themeLabel, { key: slug(themeLabel), label: themeLabel, variables: new Map() });
		}
		const theme = themes.get(themeLabel);

		const variableKey = `${slug(row.indicator)}-${slug(variableName)}`;
		if (!theme.variables.has(variableKey)) {
			theme.variables.set(variableKey, {
				key: variableKey,
				label: variableName,
				indicator: row.indicator,
				rows: []
			});
		}
		theme.variables.get(variableKey).rows.push(row);
	}

	return [...themes.values()].map((theme) => ({
		key: theme.key,
		label: theme.label,
		variables: [...theme.variables.values()].map(finishVariable)
	}));
}

function finishVariable({ key, label, indicator, rows }) {
	const hasShare = rows.some((r) => num(r.percent_2021_dt) != null);
	const field = hasShare ? 'percent' : 'value';
	const isIncome = /income|\$/i.test(`${indicator} ${label}`);

	const cities = rows.map((row) => {
		const match = cityByName.get(normalise(row.DTNAME));
		const read = (year, suffix) => num(row[`${field}_${year}_${suffix}`]);
		return {
			key: match?.key ?? `x-${slug(row.DTNAME)}`,
			name: match?.name ?? row.DTNAME,
			profiled: Boolean(match),
			downtown: { 2001: read(2001, 'dt'), 2021: read(2021, 'dt') },
			cma: { 2001: read(2001, 'cma'), 2021: read(2021, 'cma') }
		};
	});

	return {
		key,
		label,
		indicator,
		cities,
		format: hasShare ? 'pct' : isIncome ? 'money' : 'int',
		// Raw counts run from a few thousand downtown residents to millions in a
		// region, so they need a log axis to stay readable; shares and incomes don't.
		scale: hasShare || isIncome ? 'lin' : 'log',
		zeroFloor: hasShare,
		nominalDollars: isIncome && !hasShare
	};
}

/** Loads and reshapes the comparison CSV, or resolves to `[]` when it isn't present. */
export async function loadSeries() {
	if (!loadCsv) return [];
	const module = await loadCsv();
	return buildSeries(module.default ?? []);
}
