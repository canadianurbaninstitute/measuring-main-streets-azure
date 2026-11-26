import { isFrenchPath, isLocalizableHref, localizeHrefFor } from './routes/lib/i18n-core';

/**
 * Rewrite internal links in a French page so they stay in French (`/about/` -> `/fr/about/`).
 * Anchors marked with `data-lang-switch` (the language toggle) are left alone.
 * @param {string} html
 */
function localizeAnchors(html) {
	return html.replace(/<a\b[^>]*>/g, (tag) => {
		if (tag.includes('data-lang-switch')) return tag;
		return tag.replace(/(\shref=)(["'])([^"']*)\2/, (match, attr, quote, href) =>
			isLocalizableHref(href) ? `${attr}${quote}${localizeHrefFor(href, 'fr')}${quote}` : match
		);
	});
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const fr = isFrenchPath(event.url.pathname);
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			const out = html.replace('%lang%', fr ? 'fr-CA' : 'en-CA');
			return fr ? localizeAnchors(out) : out;
		}
	});
}
