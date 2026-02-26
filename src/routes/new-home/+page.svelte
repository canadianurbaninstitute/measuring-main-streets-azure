<script>
	import ModernFooter from '../lib/ui/ModernFooter.svelte';
	import '../styles.css';
	import HomeAbout from './components/HomeAbout.svelte';
	import HomeHero from './components/HomeHero.svelte';
	import HomeProjectTimeline from './components/HomeProjectTimeline.svelte';
	import HomeTabs from './components/HomeTabs.svelte';
</script>

<svelte:head>
	<title>Measuring Main Streets | Canadian Urban Institute</title>
	<meta
		name="description"
		content="Exploring Canada’s main streets through a data-driven approach to empower city builders."
	/>
</svelte:head>

<main class="new-homepage">
	<HomeHero />
	<HomeTabs />
	<HomeProjectTimeline />
	<HomeAbout />
</main>

<ModernFooter />

<style>
	:global(body) {
		background-color: white !important;
	}

	.new-homepage {
		display: flex;
		flex-direction: column;
	}
</style>
