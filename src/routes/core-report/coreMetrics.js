// Shared vocabulary for the Core Report trends explorer: region colouring, the
// measures that can be plotted, value formatting, and the beeswarm packer that
// both swarm modules share.

// Regions are coloured with the site brand tokens so the explorer stays in step
// with the rest of Measuring Main Streets.
export const REGION_OF = {
	stjohns: 'atl',
	halifax: 'atl',
	moncton: 'atl',
	montreal: 'qc',
	gatineau: 'qc',
	ottawa: 'on',
	toronto: 'on',
	hamilton: 'on',
	london: 'on',
	winnipeg: 'pr',
	saskatoon: 'pr',
	lethbridge: 'pr',
	calgary: 'pr',
	edmonton: 'pr',
	vancouver: 'bc'
};

export const REGION_COLOR = {
	atl: 'var(--brandBlue)',
	qc: 'var(--brandPurple)',
	on: 'var(--brandLightBlue)',
	pr: 'var(--brandOrange)',
	bc: 'var(--brandDarkGreen)'
};

export const REGION_LABEL = {
	atl: 'Atlantic',
	qc: 'Québec',
	on: 'Ontario',
	pr: 'Prairies',
	bc: 'British Columbia'
};

export const REGION_LEGEND = Object.keys(REGION_LABEL).map((key) => ({
	key,
	label: REGION_LABEL[key],
	color: REGION_COLOR[key]
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

/**
 * Packs one dot per core and per region along a horizontal value axis, nudging
 * collisions up and down so nothing overlaps. Positions are laid out in the
 * measured pixel width of the container so the swarm stays legible on any
 * screen — values are encoded by position, never by rank.
 *
 * @param {object} options
 * @param {any[]} options.cities        rows from coreData
 * @param {(m: any) => number} options.value  reads the measure off a core/region profile
 * @param {number} options.width        measured pixel width of the plot area
 * @param {number} options.height       pixel height of the plot area
 * @param {'lin'|'sqrt'} [options.scale] axis transform
 * @param {boolean} [options.zeroFloor] anchor the axis at zero (used for % shares)
 */
export function packSwarm({ cities, value, width, height, scale = 'lin', zeroFloor = false }) {
	const padLeft = 48;
	const padRight = 48;
	const inner = Math.max(width - padLeft - padRight, 1);

	const items = [];
	for (const city of cities) {
		const region = REGION_OF[city.key];
		const color = REGION_COLOR[region];
		items.push({
			key: city.key + '-core',
			cityKey: city.key,
			name: city.name,
			region,
			color,
			kind: 'core',
			value: value(city.downtown) || 0
		});
		items.push({
			key: city.key + '-region',
			cityKey: city.key,
			name: city.name,
			region,
			color,
			kind: 'region',
			value: value(city.cma) || 0
		});
	}

	const values = items.map((d) => d.value);
	const lo = zeroFloor ? 0 : Math.min(...values);
	const hi = zeroFloor ? Math.max(...values) * 1.02 || 1 : Math.max(...values);
	const transform = scale === 'sqrt' ? (v) => Math.sqrt(Math.max(v, 0)) : (v) => v;
	const tLo = transform(lo);
	const span = transform(hi) - tLo || 1;
	const toX = (v) => padLeft + ((transform(v) - tLo) / span) * inner;

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
		placed.push({ ...item, x, y, left, right, radius });
	}

	const coreValues = cities.map((c) => value(c.downtown) || 0);
	const average = coreValues.reduce((a, b) => a + b, 0) / coreValues.length;

	const ticks = [];
	for (let i = 0; i <= 4; i++) {
		const fraction = i / 4;
		const tickValue =
			scale === 'sqrt' ? Math.pow(tLo + fraction * span, 2) : lo + fraction * (hi - lo);
		ticks.push({ x: padLeft + fraction * inner, value: tickValue });
	}

	return { dots: placed, ticks, average, averageX: toX(average) };
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
