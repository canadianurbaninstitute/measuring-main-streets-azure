// Shared vocabulary for the Core Report trends explorer: downtown-size
// colouring, the measures that can be plotted, value formatting, and the
// beeswarm packer the swarm modules share.

import { CITIES, LATEST_YEAR, variableKey } from './coreCensus.js';

const isValue = (v) => v != null && Number.isFinite(v);

/** Reads a census count (or average, for income) off a profile. */
const count = (indicator, variable) => (profile) =>
	profile?.[variableKey(indicator, variable)]?.value ?? null;

/**
 * Reads a census share (0-100) off a profile, adding several variables of the
 * same indicator together (they share a denominator). Missing if any part is.
 */
const share =
	(indicator, ...variables) =>
	(profile) => {
		const parts = variables.map((v) => profile?.[variableKey(indicator, v)]?.percent);
		return parts.every(isValue) ? parts.reduce((a, b) => a + b, 0) : null;
	};

export const population = count('Population', 'Population');

export const SIZE_ORDER = ['small', 'medium', 'large'];

export const SIZE_COLOR = {
	small: 'var(--brandLightBlue)',
	medium: 'var(--brandOrange)',
	large: 'var(--brandPink)'
};

export const SIZE_LABEL = {
	small: 'Small downtown',
	medium: 'Medium downtown',
	large: 'Large downtown'
};

// Downtowns are split into three equal-sized tiers by their core population in
// the latest census, so the grouping stays meaningful as downtowns are added.
function computeSizeOf(cities) {
	const sorted = [...cities].sort(
		(a, b) => population(a.downtown[LATEST_YEAR]) - population(b.downtown[LATEST_YEAR])
	);
	const map = {};
	sorted.forEach((city, i) => {
		const tier = Math.min(2, Math.floor((i / sorted.length) * 3));
		map[city.key] = SIZE_ORDER[tier];
	});
	return map;
}

export const SIZE_OF = computeSizeOf(CITIES);

export const SIZE_LEGEND = SIZE_ORDER.map((key) => ({
	key,
	label: SIZE_LABEL[key],
	color: SIZE_COLOR[key]
}));

/** Formats a value for display. `null`/`NaN` render as an em dash. */
export function format(value, kind) {
	if (value == null || isNaN(value)) return '—';
	if (kind === 'money') return '$' + Math.round(value).toLocaleString('en-CA');
	if (kind === 'int') return Math.round(value).toLocaleString('en-CA');
	if (kind === 'pct') return value.toFixed(1) + '%';
	if (kind === 'dec') return value.toFixed(1);
	return String(value);
}

/**
 * The measures offered in module 01 (spread) and module 02 (relationship),
 * each read off one census-year profile. Shares are of the indicator's total
 * (households, dwellings, commuters, people).
 */
export const METRICS = [
	{
		key: 'population',
		label: 'Population',
		get: population,
		format: 'int',
		scale: 'log',
		zeroFloor: false
	},
	{
		key: 'income',
		label: 'Employment income',
		note: 'Average employment income of full-time, full-year earners.',
		get: count('Employment Income', 'Average Employment Income FTFY'),
		format: 'money',
		scale: 'lin',
		zeroFloor: false,
		nominalDollars: true
	},
	{ key: 'rented', label: 'Renters', get: share('Dwelling Tenure', 'Renter') },
	{
		key: 'carfree',
		label: 'Car-free commuting',
		note: 'The 2021 Census was taken in May 2021, during the COVID-19 pandemic, when transit use was unusually low.',
		get: share('Commute Mode', 'Public Transit', 'Walk', 'Bike')
	},
	{
		key: 'diversity',
		label: 'Visible minority',
		get: share('Visible Minority', 'Visible Minorities')
	},
	{
		key: 'recentImmigrants',
		label: 'Recent immigrants',
		note: 'Immigrated in the five years before the census.',
		get: share('Recent Immigration and NPR', 'Recent Immigrant last 5 years')
	},
	{
		key: 'movers',
		label: 'Moved in last 5 years',
		get: share('Mobility', 'Non migrants', 'Internal migrants', 'External migrants')
	},
	{
		key: 'youngAdults',
		label: 'Aged 25 to 34',
		get: share('Age', 'Age 25 to 29', 'Age 30 to 34')
	},
	{
		key: 'onePerson',
		label: 'One-person households',
		get: share('Household Size', 'Household Size: 1 person')
	},
	{
		key: 'apartments',
		label: 'Apartments',
		get: share(
			'Dwelling Type',
			'Apartment in a building that has fewer than five storeys',
			'Apartment in a building that has five or more storeys'
		)
	},
	{
		key: 'newbuild',
		label: 'Built in last 10 years',
		get: share('Dwelling Construction', 'Built in previous 10 years')
	}
].map((metric) => ({ format: 'pct', scale: 'lin', zeroFloor: true, ...metric }));

/** The occupation groups offered in module 03, as shares of all occupations. */
export const OCCUPATIONS = [
	['management', 'Management', 'Legislation and Senior Management'],
	['business', 'Business & admin', 'Business Finance and Administration'],
	['sciences', 'Sciences', 'Natural and Applied Science'],
	['health', 'Health', 'Health Occupations'],
	['social', 'Education, law & government', 'Education Law, Community, and Government'],
	['arts', 'Art & culture', 'Arts Culture and Sport'],
	['sales', 'Sales & service', 'Sales and Services'],
	['trades', 'Trades & transport', 'Trades and Transport'],
	['primary', 'Natural resources', 'Natural resources and Agriculture'],
	['manufacturing', 'Manufacturing', 'Manufacturing and Utilities']
].map(([key, label, variable]) => ({
	key,
	label,
	get: share('Occupation', variable),
	format: 'pct',
	scale: 'lin',
	zeroFloor: true
}));

// Fallback for a city without a size group, so its dot still draws.
const FALLBACK_COLOR = '#e4ecf0';

const SCALES = {
	lin: { to: (v) => v, from: (t) => t },
	sqrt: { to: (v) => Math.sqrt(Math.max(v, 0)), from: (t) => t * t },
	log: { to: (v) => Math.log10(Math.max(v, 1)), from: (t) => Math.pow(10, t) }
};

/**
 * Packs one dot per core and per wider region along a horizontal value axis, nudging
 * collisions up and down so nothing overlaps. Positions are laid out in the
 * measured pixel width of the container so the swarm stays legible on any
 * screen — values are encoded by position, never by rank. Missing values are
 * left off the swarm rather than drawn at zero.
 *
 * @param {object} options
 * @param {any[]} options.cities        rows carrying `downtown` and `cma`, which `value` reads
 * @param {(m: any) => number} options.value  reads the measure off a core/region profile
 * @param {number} options.width        measured pixel width of the plot area
 * @param {number} options.height       pixel height of the plot area
 * @param {'lin'|'sqrt'|'log'} [options.scale] axis transform
 * @param {boolean} [options.zeroFloor] anchor the axis at zero (used for % shares)
 * @param {[number, number]} [options.domain] fixed axis range, so animated frames share one axis
 * @param {(m: any) => number} [options.compare] reads a comparison value (e.g. an earlier
 *        census year); each dot then carries `compareX`
 */
export function packSwarm({
	cities,
	value,
	width,
	height,
	scale = 'lin',
	zeroFloor = false,
	domain = null,
	compare = null
}) {
	const padLeft = 48;
	const padRight = 48;
	const inner = Math.max(width - padLeft - padRight, 1);

	const items = [];
	for (const city of cities) {
		const sizeGroup = SIZE_OF[city.key];
		const color = SIZE_COLOR[sizeGroup] ?? FALLBACK_COLOR;
		for (const [kind, profile] of [
			['core', city.downtown],
			['region', city.cma]
		]) {
			const itemValue = value(profile);
			if (!isValue(itemValue)) continue;
			items.push({
				key: `${city.key}-${kind}`,
				cityKey: city.key,
				name: city.name,
				sizeGroup,
				color,
				kind,
				value: itemValue,
				compareValue: compare ? compare(profile) : null
			});
		}
	}

	const values = domain ?? items.map((d) => d.value);
	const lo = zeroFloor ? 0 : values.length ? Math.min(...values) : 0;
	const hi = values.length ? Math.max(...values) * (zeroFloor ? 1.02 : 1) || 1 : 1;
	const { to, from } = SCALES[scale] ?? SCALES.lin;
	const tLo = to(lo);
	const span = to(hi) - tLo || 1;
	const toX = (v) => padLeft + ((to(v) - tLo) / span) * inner;

	// Collision packing: walk left to right, offsetting each dot alternately above
	// and below the centre line until it clears everything already placed.
	const radius = width < 640 ? 7 : 10;
	const gap = 2 * radius + 1;
	const centre = height / 2 - 12;
	const placed = [];
	for (const item of [...items].sort((a, b) => a.value - b.value)) {
		const x = toX(item.value);
		const left = x - radius;
		const right = x + radius;
		let y = centre;
		let step = 0;
		const collides = (candidate) =>
			placed.some((p) => Math.abs(p.y - candidate) < gap && !(right < p.left || left > p.right));
		while (collides(y)) {
			step++;
			y = centre + (step % 2 ? -1 : 1) * Math.ceil(step / 2) * gap;
		}
		const compareX = isValue(item.compareValue) ? toX(item.compareValue) : null;
		placed.push({ ...item, x, y, left, right, radius, compareX });
	}

	const mean = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);
	const average = mean(cities.map((c) => value(c.downtown)).filter(isValue));
	const compareAverage = compare
		? mean(cities.map((c) => compare(c.downtown)).filter(isValue))
		: null;

	// Ticks are rounded to as few significant figures as keep them distinct
	// (9,253 → 9,300), then placed at their rounded value so they stay truthful.
	const rawTicks = [0, 1, 2, 3, 4].map((i) => from(tLo + (i / 4) * span));
	let tickValues = rawTicks;
	for (let digits = 2; digits <= 6; digits++) {
		const rounded = rawTicks.map((v) => Number(v.toPrecision(digits)));
		if (new Set(rounded).size === rounded.length) {
			tickValues = rounded;
			break;
		}
	}
	const ticks = tickValues.map((tickValue) => ({ x: toX(tickValue), value: tickValue }));

	return {
		dots: placed,
		ticks,
		average,
		averageX: average == null ? null : toX(average),
		compareAverage,
		compareAverageX: compareAverage == null ? null : toX(compareAverage)
	};
}

/**
 * Pearson correlation between two equal-length series, or `null` when either
 * series is flat. Used to tell the reader how strong a scatter pairing is.
 */
export function correlation(xs, ys) {
	const n = xs.length;
	if (n < 3) return null;
	const meanX = xs.reduce((a, b) => a + b, 0) / n;
	const meanY = ys.reduce((a, b) => a + b, 0) / n;
	let sxy = 0;
	let sxx = 0;
	let syy = 0;
	for (let i = 0; i < n; i++) {
		const dx = xs[i] - meanX;
		const dy = ys[i] - meanY;
		sxy += dx * dy;
		sxx += dx * dx;
		syy += dy * dy;
	}
	if (sxx === 0 || syy === 0) return null;
	return sxy / Math.sqrt(sxx * syy);
}

/** Plain-language reading of a correlation coefficient. */
export function correlationLabel(r) {
	if (r == null) return 'No relationship to read';
	const strength = Math.abs(r);
	const direction = r > 0 ? 'positive' : 'negative';
	if (strength >= 0.7) return `Strong ${direction} relationship`;
	if (strength >= 0.4) return `Moderate ${direction} relationship`;
	if (strength >= 0.2) return `Weak ${direction} relationship`;
	return 'Little to no relationship';
}
