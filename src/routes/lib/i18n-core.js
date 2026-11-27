// Pure path/locale helpers shared by the routing hooks and components. No SvelteKit imports.

/** @typedef {'en' | 'fr'} Lang */

export const FR_PREFIX = '/fr';

/**
 * Montreal case studies and the Montreal report were translated by hand before this i18n layer
 * existed and live in their own `-fr` route folders. These maps keep their French URLs consistent
 * with the rest of the site (`/fr/casestudies/montreal/<slug>/`).
 */
const MONTREAL_CASE_STUDY = /^\/casestudies\/montreal\/([^/]+)\/?$/;
const MONTREAL_CASE_STUDY_FR = /^\/casestudies\/montreal-fr\/([^/]+)-fr\/?$/;
const MONTREAL_REPORT = /^\/reports\/montreal\/?$/;
const MONTREAL_REPORT_FR = /^\/reports\/montreal-fr\/?$/;

/** @param {string} pathname */
export function isFrenchPath(pathname) {
	return (
		pathname === FR_PREFIX ||
		pathname.startsWith(FR_PREFIX + '/') ||
		MONTREAL_CASE_STUDY_FR.test(pathname) ||
		MONTREAL_REPORT_FR.test(pathname)
	);
}

/**
 * Strip the `/fr` prefix (and legacy Montreal `-fr` routes) to get the English pathname.
 * @param {string} pathname
 */
export function toEnglishPath(pathname) {
	let p = pathname;
	if (p === FR_PREFIX || p.startsWith(FR_PREFIX + '/')) p = p.slice(FR_PREFIX.length) || '/';
	const cs = p.match(MONTREAL_CASE_STUDY_FR);
	if (cs) return `/casestudies/montreal/${cs[1]}/`;
	if (MONTREAL_REPORT_FR.test(p)) return '/reports/montreal/';
	return p;
}

/**
 * Turn any internal pathname into its French equivalent (`/about/` -> `/fr/about/`).
 * @param {string} pathname
 */
export function toFrenchPath(pathname) {
	const en = toEnglishPath(pathname);
	return en === '/' ? FR_PREFIX + '/' : FR_PREFIX + en;
}

/**
 * Map a French URL onto the route that actually renders it. Used by the `reroute` hook.
 * Returns undefined for English URLs.
 * @param {string} pathname
 */
export function rerouteFrench(pathname) {
	if (!(pathname === FR_PREFIX || pathname.startsWith(FR_PREFIX + '/'))) return undefined;
	const p = pathname.slice(FR_PREFIX.length) || '/';
	const cs = p.match(MONTREAL_CASE_STUDY);
	if (cs) return `/casestudies/montreal-fr/${cs[1]}-fr/`;
	if (MONTREAL_REPORT.test(p)) return '/reports/montreal-fr/';
	return p;
}

/**
 * Whether an href points at a page on this site that should be localised.
 * @param {string | null | undefined} href
 */
export function isLocalizableHref(href) {
	if (!href || !href.startsWith('/') || href.startsWith('//')) return false;
	if (href.startsWith('/_app/')) return false;
	// Static assets (files with an extension, e.g. /favicon.ico, /data.csv)
	const path = href.split(/[?#]/)[0];
	if (/\.[a-z0-9]{2,5}$/i.test(path)) return false;
	return true;
}

/**
 * Localise an internal href for the given language.
 * External links, anchors and assets are returned unchanged.
 * @param {string} href
 * @param {Lang} l
 */
export function localizeHrefFor(href, l) {
	if (!isLocalizableHref(href)) return href;
	const [path, rest = ''] = splitHref(href);
	const localized = l === 'fr' ? toFrenchPath(path) : toEnglishPath(path);
	return localized + rest;
}

/** @param {string} href */
function splitHref(href) {
	const i = href.search(/[?#]/);
	return i === -1 ? [href, ''] : [href.slice(0, i), href.slice(i)];
}

/**
 * Format a number using the current page's locale conventions (Canadian French uses a
 * non-breaking space as thousands separator and a comma as decimal separator).
 * @param {Lang} l
 * @param {number} value
 * @param {Intl.NumberFormatOptions} [options]
 */
export function formatNumberFor(l, value, options) {
	return new Intl.NumberFormat(l === 'fr' ? 'fr-CA' : 'en-CA', options).format(value);
}
