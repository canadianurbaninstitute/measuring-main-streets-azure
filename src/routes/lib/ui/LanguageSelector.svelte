<!-- UI component that displays an option for selecting french and english used on Measuring Main Streets case studies and Montreal report.-->
<script>
	export let eng;
	export let fr;
	export let selected;
</script>

<!-- TODO: Use semantic html nav components -->
<div id="language-selector">
	<h4>
		<a data-sveltekit-preload-data="false" href={eng} class:selected={selected === 'eng'}>ENGLISH</a
		>
	</h4>
	<h4>|</h4>
	<h4>
		<a data-sveltekit-preload-data="false" href={fr} class:selected={selected === 'fr'}>FRANÇAIS</a>
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
