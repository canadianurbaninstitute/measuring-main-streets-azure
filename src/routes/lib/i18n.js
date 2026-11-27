// Lightweight bilingual (English / Canadian French) support for Measuring Main Streets.
//
// French pages are served under the `/fr/` prefix (e.g. `/fr/about/`). The `reroute` hook in
// `src/hooks.js` maps those URLs onto the same route files used for English, so every page
// component renders both languages. Components decide which language to show with `getLang()`.
//
// Usage inside a component's <script> (call during component initialisation, i.e. at the top
// level of <script>, not inside callbacks or effects):
//
//   import { getLang } from '../lib/i18n';
//   const fr = getLang() === 'fr';
//
//   {fr ? 'Vue d’ensemble' : 'Overview'}
//   {#if fr}<p>Texte en français…</p>{:else}<p>English text…</p>{/if}
//
// All navigation on the site is a full page load (data-sveltekit-reload), so the language never
// changes during a page's lifetime and a plain constant is sufficient.
//
// Internal links do not need to be localised by hand: French pages have their `<a href="/…">`
// rewritten to `/fr/…` (see `src/hooks.server.js` and the click handler in `+layout.svelte`).
// Use `localizeHref()` only where a URL is used outside an anchor (e.g. `goto`, `window.location`).

import { page } from '$app/state';
import { formatNumberFor, isFrenchPath, localizeHrefFor } from './i18n-core';

export * from './i18n-core';

/**
 * Current page language. Call during component initialisation (top level of <script>).
 * @returns {import('./i18n-core').Lang}
 */
export function getLang() {
	return isFrenchPath(page.url.pathname) ? 'fr' : 'en';
}

/**
 * Pick the English or French value for the current page.
 * Call during component initialisation or from the template.
 * @template T
 * @param {T} en
 * @param {T} fr
 * @returns {T}
 */
export function t(en, fr) {
	return getLang() === 'fr' ? fr : en;
}

/**
 * Localise an internal href for the current page language (or the given one).
 * @param {string} href
 * @param {import('./i18n-core').Lang} [lang]
 */
export function localizeHref(href, lang) {
	return localizeHrefFor(href, lang ?? getLang());
}

/**
 * Format a number with Canadian English / Canadian French conventions.
 * @param {number} value
 * @param {Intl.NumberFormatOptions} [options]
 * @param {import('./i18n-core').Lang} [lang]
 */
export function formatNumber(value, options, lang) {
	return formatNumberFor(lang ?? getLang(), value, options);
}
