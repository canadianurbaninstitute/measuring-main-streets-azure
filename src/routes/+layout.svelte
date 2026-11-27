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

		/** @param {Element | null | undefined} anchor */
		function localizeAnchor(anchor) {
			if (!anchor || anchor.tagName !== 'A' || anchor.hasAttribute('data-lang-switch')) return;
			const href = anchor.getAttribute('href');
			if (href && isLocalizableHref(href)) {
				const localized = localizeHrefFor(href, 'fr');
				if (localized !== href) anchor.setAttribute('href', localized);
			}
		}

		/** @param {ParentNode} root */
		function localizeAll(root) {
			root.querySelectorAll('a[href]').forEach(localizeAnchor);
		}

		// Svelte resets dynamic hrefs while hydrating, and components add links later (cards, popups),
		// so localise everything now and keep watching for new or changed links.
		localizeAll(document);
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.type === 'attributes') localizeAnchor(/** @type {Element} */ (m.target));
				else
					m.addedNodes.forEach((node) => {
						if (node instanceof Element) {
							localizeAnchor(node);
							localizeAll(node);
						}
					});
			}
		});
		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ['href']
		});

		// Safety net just before a link is followed.
		/** @param {Event} event */
		function onInteract(event) {
			localizeAnchor(/** @type {Element | null} */ (event.target)?.closest?.('a[href]'));
		}
		const events = ['pointerdown', 'focusin', 'click', 'auxclick', 'contextmenu'];
		events.forEach((name) => document.addEventListener(name, onInteract, true));
		return () => {
			observer.disconnect();
			events.forEach((name) => document.removeEventListener(name, onInteract, true));
		};
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
