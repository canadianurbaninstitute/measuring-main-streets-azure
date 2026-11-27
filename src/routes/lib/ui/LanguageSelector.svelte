<!-- UI component that displays an option for selecting french and english used on Measuring Main Streets case studies and Montreal report.-->
<script>
	import { page } from '$app/stores';
	import { isFrenchPath, toEnglishPath, toFrenchPath } from '../i18n';

	// `eng` / `fr` are kept for backwards compatibility but the links are now derived from the
	// current URL so they always point at the canonical English and `/fr/` pages.
	export let eng = undefined;
	export let fr = undefined;
	// Ignored: the selected language is derived from the URL.
	export let selected = undefined;

	$: engHref = toEnglishPath($page.url.pathname);
	$: frHref = toFrenchPath($page.url.pathname);
	$: current = isFrenchPath($page.url.pathname) ? 'fr' : 'eng';
</script>

<!-- TODO: Use semantic html nav components -->
<div id="language-selector">
	<h4>
		<a
			data-sveltekit-preload-data="false"
			data-sveltekit-reload
			data-lang-switch
			lang="en"
			href={engHref}
			class:selected={current === 'eng'}>ENGLISH</a
		>
	</h4>
	<h4>|</h4>
	<h4>
		<a
			data-sveltekit-preload-data="false"
			data-sveltekit-reload
			data-lang-switch
			lang="fr"
			href={frHref}
			class:selected={current === 'fr'}>FRANÇAIS</a
		>
	</h4>
</div>

<style>
	#language-selector {
		display: flex;
		flex-direction: row;
		gap: 1em;
		width: 2em;
		padding: 2em 0 0 5em;
	}

	a {
		text-decoration: none;
		color: var(--brandLightBlue);
	}

	a.selected {
		color: var(--brandDarkBlue);
		font-weight: bold;
	}
</style>
