<script>
	import HomeAbout from './components/HomeAbout.svelte';
	import HomeHero from './components/HomeHero.svelte';
	import HomeProjectTimeline from './components/HomeProjectTimeline.svelte';
	import { getLang } from './lib/i18n';
	import './styles.css';

	const fr = getLang() === 'fr';
</script>

<svelte:head>
	<title
		>{fr
			? 'Mesures des rues principales | Institut urbain du Canada'
			: 'Measuring Main Streets | Canadian Urban Institute'}</title
	>
	<meta
		name="description"
		content={fr
			? 'Rendre les données plus accessibles pour la vitalité des rues principales et des centres-villes'
			: 'Making Data More Accessible for Main Street & Downtown Vibrancy'}
	/>
</svelte:head>

<main class="new-homepage">
	<HomeHero />
	<HomeProjectTimeline />
	<HomeAbout />
</main>

<style>
	:global(body) {
		background-color: white !important;
	}

	.new-homepage {
		display: flex;
		flex-direction: column;
	}
</style>
