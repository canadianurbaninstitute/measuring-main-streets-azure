// Shared vocabulary for the Core Report trends explorer: downtown-size
// colouring, the measures that can be plotted, value formatting, and the
// beeswarm packer the swarm modules share.

import { CITIES, LATEST_YEAR, defineMeasure, variableKey } from './coreCensus.js';

const isValue = (v) => v != null && Number.isFinite(v);

/**
 * Reads a census count (or average, for income) off a profile. The reader
 * carries its census definition, for the "what this measures" panels.
 */
const count = (indicator, variable) =>
	Object.assign((profile) => profile?.[variableKey(indicator, variable)]?.value ?? null, {
		definition: defineMeasure(indicator, [variable])
	});

/**
 * Reads a census share (0-100) off a profile, adding several variables of the
 * same indicator together (they share a denominator). Missing if any part is.
 */
const share = (indicator, ...variables) =>
	Object.assign(
		(profile) => {
			const parts = variables.map((v) => profile?.[variableKey(indicator, v)]?.percent);
			return parts.every(isValue) ? parts.reduce((a, b) => a + b, 0) : null;
		},
		{ definition: defineMeasure(indicator, variables) }
	);

export const population = count('Population', 'Population');

export const SIZE_ORDER = ['small', 'medium', 'large', 'veryLarge'];

export const SIZE_COLOR = {
	small: 'var(--brandLightBlue)',
	medium: 'var(--brandOrange)',
	large: 'var(--brandPink)',
	veryLarge: 'var(--brandGreen)'
};

export const SIZE_LABEL = {
	small: 'Small downtown',
	medium: 'Medium downtown',
	large: 'Large downtown',
	veryLarge: 'Very large downtown'
};

// Downtown residents (latest census) at which each larger group starts. The
// breaks are half-decades (10^3.5, 10^4, 10^4.5, rounded), evenly spaced on a
// log scale: downtowns run from under a thousand residents to 300,000, and a
// linear split would lump nearly all of them into "small". Fixed breaks keep a
// downtown's group stable as more downtowns are added.
const SIZE_BREAKS = [3000, 10000, 30000];

const SIZE_RANGE = {
	small: `under ${SIZE_BREAKS[0].toLocaleString('en-CA')}`,
	medium: `${SIZE_BREAKS[0].toLocaleString('en-CA')}–${SIZE_BREAKS[1].toLocaleString('en-CA')}`,
	large: `${SIZE_BREAKS[1].toLocaleString('en-CA')}–${SIZE_BREAKS[2].toLocaleString('en-CA')}`,
	veryLarge: `${SIZE_BREAKS[2].toLocaleString('en-CA')}+`
};

function sizeOf(city) {
	const residents = population(city.downtown[LATEST_YEAR]);
	if (residents == null) return null;
	return SIZE_ORDER[SIZE_BREAKS.filter((b) => residents >= b).length];
}

export const SIZE_OF = Object.fromEntries(CITIES.map((city) => [city.key, sizeOf(city)]));

export const SIZE_LEGEND = SIZE_ORDER.map((key) => ({
	key,
	label: SIZE_LABEL[key],
	range: SIZE_RANGE[key],
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
		key: 'density',
		label: 'Density',
		note: 'People per km²: census population divided by area. Downtown area is measured from the downtown boundary, so only downtowns with a mapped boundary have a density; region area is Statistics Canada’s 2021 land area, so regions have no 2001 density, and the boundary file does not yet include Ottawa–Gatineau.',
		get: count('Density', 'Population density'),
		definition: defineMeasure('Population', ['Population']),
		format: 'int',
		scale: 'sqrt',
		unit: '/km²',
		zeroFloor: false
	},
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
].map((metric) => ({
	format: 'pct',
	scale: 'lin',
	zeroFloor: true,
	definition: metric.get.definition,
	...metric
}));

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
].map(([key, label, variable]) => {
	const get = share('Occupation', variable);
	return {
		key,
		label,
		get,
		definition: get.definition,
		format: 'pct',
		scale: 'lin',
		zeroFloor: true
	};
});

// Fallback for a city without a size group, so its dot still draws.
const FALLBACK_COLOR = '#7d97a5';

const SCALES = {
	lin: { to: (v) => v, from: (t) => t },
	sqrt: { to: (v) => Math.sqrt(Math.max(v, 0)), from: (t) => t * t },
	log: { to: (v) => Math.log10(Math.max(v, 1)), from: (t) => Math.pow(10, t) }
};

/**
 * Ticks for a log axis at 1, 3, 10, 30, 100… within [lo, hi] — the steps a
 * reader can place at a glance, and the same steps as the size groups.
 * Returns null when fewer than two fall inside, so the caller can fall back.
 */
export function logTicks(lo, hi) {
	const ticks = [];
	for (let exp = Math.floor(Math.log10(Math.max(lo, 1))); 10 ** exp <= hi; exp++) {
		for (const step of [1, 3]) {
			const tick = step * 10 ** exp;
			if (tick >= lo && tick <= hi) ticks.push(tick);
		}
	}
	return ticks.length >= 2 ? ticks : null;
}

/**
 * Packs one dot per downtown core and one per region along a horizontal value
 * axis, nudging collisions up and down so nothing overlaps. Downtowns sharing a
 * region (Toronto, Mississauga, Brampton…) share its one dot, so identical
 * region values never stack up as false clusters. Positions are laid out in the
 * measured pixel width of the container so the swarm stays legible on any
 * screen — values are encoded by position, never by rank. Missing values are
 * left off the swarm rather than drawn at zero.
 *
 * Dot `y` is relative to the swarm's centre line; `extent` is how far the
 * swarm reaches above or below it, so the caller can size the plot to fit.
 *
 * @param {object} options
 * @param {any[]} options.cities        rows carrying `downtown` and `cma`, which `value` reads
 * @param {(m: any) => number} options.value  reads the measure off a core/region profile
 * @param {number} options.width        measured pixel width of the plot area
 * @param {'lin'|'sqrt'|'log'} [options.scale] axis transform
 * @param {boolean} [options.zeroFloor] anchor the axis at zero (used for % shares)
 * @param {[number, number]} [options.domain] fixed axis range, so animated frames share one axis
 * @param {(m: any) => number} [options.compare] reads a comparison value (e.g. an earlier
 *        census year); each dot then carries `compareX`
 * @param {{ core: boolean, region: boolean }} [options.kinds] which kinds of dot to draw
 */
export function packSwarm({
	cities,
	value,
	width,
	scale = 'lin',
	zeroFloor = false,
	domain = null,
	compare = null,
	kinds = { core: true, region: true }
}) {
	const padLeft = 48;
	const padRight = 48;
	const inner = Math.max(width - padLeft - padRight, 1);

	const items = [];
	const regions = new Map();
	for (const city of cities) {
		const sizeGroup = SIZE_OF[city.key];
		const color = SIZE_COLOR[sizeGroup] ?? FALLBACK_COLOR;
		const coreValue = kinds.core ? value(city.downtown) : null;
		if (isValue(coreValue)) {
			items.push({
				order: items.length,
				key: `core-${city.key}`,
				cityKeys: [city.key],
				name: city.name,
				color,
				kind: 'core',
				value: coreValue,
				compareValue: compare ? compare(city.downtown) : null
			});
		}

		// A shared region takes the colour of the first downtown listed in it.
		const shared = regions.get(city.cmaKey);
		if (shared) {
			shared.cityKeys.push(city.key);
			continue;
		}
		const regionValue = kinds.region && city.cmaKey ? value(city.cma) : null;
		if (!isValue(regionValue)) continue;
		const region = {
			order: items.length,
			key: `region-${city.cmaKey}`,
			cityKeys: [city.key],
			name: city.cmaName ?? city.name,
			color,
			kind: 'region',
			value: regionValue,
			compareValue: compare ? compare(city.cma) : null
		};
		regions.set(city.cmaKey, region);
		items.push(region);
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
	// Hundreds of dots need smaller marks to stay a swarm rather than a wall.
	const crowded = items.length > 80;
	const radius = width < 640 ? (crowded ? 3 : 7) : crowded ? 4.5 : 10;
	const gap = 2 * radius + 1;
	const placed = [];
	let extent = radius;
	for (const item of [...items].sort((a, b) => a.value - b.value)) {
		const x = toX(item.value);
		const left = x - radius;
		const right = x + radius;
		// Placed dots run left to right, so only those reaching past `left` can touch.
		const near = placed.filter((p) => p.right >= left);
		let y = 0;
		let step = 0;
		while (near.some((p) => Math.abs(p.y - y) < gap)) {
			step++;
			y = (step % 2 ? -1 : 1) * Math.ceil(step / 2) * gap;
		}
		extent = Math.max(extent, Math.abs(y) + radius);
		const compareX = isValue(item.compareValue) ? toX(item.compareValue) : null;
		placed.push({ ...item, x, y, left, right, radius, compareX });
	}

	const mean = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);
	const average = mean(cities.map((c) => value(c.downtown)).filter(isValue));
	const compareAverage = compare
		? mean(cities.map((c) => compare(c.downtown)).filter(isValue))
		: null;

	// Linear ticks are rounded to as few significant figures as keep them
	// distinct (9,253 → 9,300), then placed at their rounded value so they stay
	// truthful; log axes step 1, 3, 10, 30…
	let tickValues = scale === 'log' ? logTicks(lo, hi) : null;
	if (!tickValues) {
		const rawTicks = [0, 1, 2, 3, 4].map((i) => from(tLo + (i / 4) * span));
		tickValues = rawTicks;
		for (let digits = 2; digits <= 6; digits++) {
			const rounded = rawTicks.map((v) => Number(v.toPrecision(digits)));
			if (new Set(rounded).size === rounded.length) {
				tickValues = rounded;
				break;
			}
		}
	}
	const ticks = tickValues.map((tickValue) => ({ x: toX(tickValue), value: tickValue }));

	return {
		// Back in input order, so the dots render in the same DOM order every time.
		// Reordering keyed elements re-inserts them, and a re-inserted element
		// drops its CSS transition: dots would jump between years, not glide.
		dots: placed.sort((a, b) => a.order - b.order),
		extent,
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
