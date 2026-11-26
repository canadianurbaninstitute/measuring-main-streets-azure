import { rerouteFrench } from './routes/lib/i18n-core';

/**
 * French pages live under `/fr/…` but are rendered by the same route files as English pages.
 * @type {import('@sveltejs/kit').Reroute}
 */
export function reroute({ url }) {
	return rerouteFrench(url.pathname);
}
