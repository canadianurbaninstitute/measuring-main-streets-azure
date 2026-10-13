// Shared vocabulary for the Core Report trends explorer: downtown-size
// colouring, the measures that can be plotted, value formatting, and the
// beeswarm packer that both swarm modules share.

import { CITIES } from '../lib/data/coredata/coreData.js';

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

// Downtowns are split into three equal-sized tiers by their core population,
// so the grouping stays meaningful as more downtowns are added over time.
function computeSizeOf(cities) {
	const sorted = [...cities].sort((a, b) => a.downtown.population - b.downtown.population);
	const map = {};
	sorted.forEach((city, i) => {
		const tier = Math.min(2, Math.floor((i / sorted.length) * 3));
		map[city.key] = SIZE_ORDER[tier];
	});
	return map;
}

// Manual corrections to the population-derived tiers above. Edmonton's core
// population is known-bad upstream (city-wide, not downtown-only) and reads
// as "large" as a result; Winnipeg is moved down to sit alongside it.
const SIZE_OVERRIDES = {
	edmonton: 'medium',
	winnipeg: 'medium'
};

export const SIZE_OF = { ...computeSizeOf(CITIES), ...SIZE_OVERRIDES };

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

/** The measures offered in module 01 (spread) and module 02 (relationship). */
export const METRICS = [
	{
		key: 'density',
		label: 'Density',
		get: (m) => m.density,
		format: 'int',
		scale: 'sqrt',
		unit: '/km²'
	},
	{
		key: 'avgIncome',
		label: 'Average income',
		get: (m) => m.avgIncome,
		format: 'money',
		scale: 'lin'
	},
	{ key: 'rented', label: 'Renters', get: (m) => m.rented, format: 'pct', scale: 'lin' },
	{
		key: 'university',
		label: 'University degree',
		get: (m) => m.universityDegree,
		format: 'pct',
		scale: 'lin'
	},
	{
		key: 'carfree',
		label: 'Car-free commuting',
		get: (m) => m.commute.transit + m.commute.walk + m.commute.bike,
		format: 'pct',
		scale: 'lin'
	},
	{
		key: 'diversity',
		label: 'Visible minority',
		get: (m) => m.visibleMinority,
		format: 'pct',
		scale: 'lin'
	},
	{
		key: 'newbuild',
		label: 'Built since 2016',
		get: (m) => m.builtAfter2016,
		format: 'pct',
		scale: 'lin'
	},
	{ key: 'age', label: 'Average age', get: (m) => m.avgAge, format: 'dec', scale: 'lin' },
	{
		key: 'onePerson',
		label: 'One-person households',
		get: (m) => m.onePerson,
		format: 'pct',
		scale: 'lin'
	},
	{
		key: 'apartments',
		label: 'Apartments',
		get: (m) => m.apartmentHigh + m.apartmentLow,
		format: 'pct',
		scale: 'lin'
	}
];

/** The workforce categories offered in module 03, split by industry and occupation. */
export const INDUSTRIES = [
	{ key: 'professional', label: 'Professional & tech', get: (m) => m.industries.professional },
	{ key: 'finance', label: 'Finance & insurance', get: (m) => m.industries.finance },
	{ key: 'information', label: 'Information & culture', get: (m) => m.industries.information },
	{ key: 'publicAdmin', label: 'Public admin', get: (m) => m.industries.publicAdmin },
	{ key: 'health', label: 'Health & social', get: (m) => m.industries.health },
	{ key: 'education', label: 'Education', get: (m) => m.industries.education },
	{ key: 'retail', label: 'Retail', get: (m) => m.industries.retail },
	{ key: 'accommodation', label: 'Accommodation & food', get: (m) => m.industries.accommodation },
	{ key: 'realEstate', label: 'Real estate', get: (m) => m.industries.realEstate },
	{ key: 'construction', label: 'Construction', get: (m) => m.industries.construction },
	{ key: 'manufacturing', label: 'Manufacturing', get: (m) => m.industries.manufacturing },
	{
		key: 'transportation',
		label: 'Transport & warehouse',
		get: (m) => m.industries.transportation
	},
	{ key: 'arts', label: 'Arts & recreation', get: (m) => m.industries.arts }
];

export const OCCUPATIONS = [
	{ key: 'management', label: 'Management', get: (m) => m.occupations.management },
	{ key: 'business', label: 'Business & admin', get: (m) => m.occupations.business },
	{ key: 'sciences', label: 'Sciences', get: (m) => m.occupations.sciences },
	{ key: 'health', label: 'Health', get: (m) => m.occupations.health },
	{ key: 'social', label: 'Social & education', get: (m) => m.occupations.social },
	{ key: 'arts', label: 'Art & culture', get: (m) => m.occupations.arts },
	{ key: 'sales', label: 'Sales & service', get: (m) => m.occupations.sales },
	{ key: 'trades', label: 'Trades & transport', get: (m) => m.occupations.trades },
	{ key: 'manufacturing', label: 'Manufacturing', get: (m) => m.occupations.manufacturing }
];

// Fallback for a city without a size group, so its dot still draws.
const FALLBACK_COLOR = '#e4ecf0';

const SCALES = {
	lin: { to: (v) => v, from: (t) => t },
	sqrt: { to: (v) => Math.sqrt(Math.max(v, 0)), from: (t) => t * t },
	log: { to: (v) => Math.log10(Math.max(v, 1)), from: (t) => Math.pow(10, t) }
};

const isValue = (v) => v != null && Number.isFinite(v);

/**
 * Packs one dot per core and per wider region along a horizontal value axis, nudging
 * collisions up and down so nothing overlaps. Positions are laid out in the
 * measured pixel width of the container so the swarm stays legible on any
 * screen — values are encoded by position, never by rank. Missing values are
 * left off the swarm rather than drawn at zero.
 *
 * @param {object} options
 * @param {any[]} options.cities        rows from coreData (or coreTimeSeries)
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
