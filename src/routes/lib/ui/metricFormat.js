// Display helper for metric components (Metric, TransitMetric, DonutMetric, GaugeMetric).
// English output is `${prefix}${value}${suffix}`, unchanged. On French pages, numbers use a comma
// as decimal separator and a non-breaking space as thousands separator, `%` and `$` follow the
// number with a non-breaking space (`45,3 %`, `12 000 $`).

const NBSP = ' ';

/**
 * @param {unknown} value
 */
function frenchNumber(value) {
	if (typeof value === 'number') return String(value).replace('.', ',');
	if (typeof value === 'string' && /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/.test(value)) {
		return value.replace(/,/g, NBSP).replace('.', ',');
	}
	return value;
}

/**
 * @param {string | null | undefined} prefix
 * @param {unknown} value
 * @param {string | null | undefined} suffix
 * @param {boolean} fr
 * @returns {string}
 */
export function formatMetric(prefix, value, suffix, fr) {
	const p = prefix ?? '';
	const s = suffix ?? '';
	const v = value ?? '';
	if (!fr) return `${p}${v}${s}`;
	const out = `${frenchNumber(v)}`;
	let pre = p;
	let post = s;
	if (pre === '$') {
		pre = '';
		post = `${NBSP}$${post}`;
	}
	if (post.startsWith('%')) post = NBSP + post;
	return `${pre}${out}${post}`;
}
