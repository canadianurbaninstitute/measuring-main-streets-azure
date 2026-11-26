<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { getLang, isLocalizableHref, localizeHrefFor } from './lib/i18n';
	import Footer from './lib/ui/Footer.svelte';
	import TopBar from './lib/ui/TopBar.svelte';

	const lang = getLang();

	// Server-rendered links on French pages are already rewritten to /fr/… (see hooks.server.js),
	// but links that Svelte updates after hydration, or that are created later by scripts, are not.
	// Localise them just before they are followed.
	onMount(() => {
		if (lang !== 'fr') return;

		/** @param {Event} event */
		function localize(event) {
			const target = /** @type {Element | null} */ (event.target);
			const anchor = target?.closest?.('a[href]');
			if (!anchor || anchor.hasAttribute('data-lang-switch')) return;
			const href = anchor.getAttribute('href');
			if (href && isLocalizableHref(href)) {
				const localized = localizeHrefFor(href, 'fr');
				if (localized !== href) anchor.setAttribute('href', localized);
			}
		}

		const events = ['pointerdown', 'focusin', 'click', 'auxclick', 'contextmenu'];
		events.forEach((name) => document.addEventListener(name, localize, true));
		return () => events.forEach((name) => document.removeEventListener(name, localize, true));
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me/" />
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
	<script
		id="cookieyes"
		type="text/javascript"
		src="https://cdn-cookieyes.com/client_data/81adfe725a18120f5ab6d58a/script.js"
	></script>
</svelte:head>

<TopBar />

<slot />

<Footer />
