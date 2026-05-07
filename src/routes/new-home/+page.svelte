<script>
	import '../styles.css';
	import HomeAbout from './components/HomeAbout.svelte';
	import HomeHero from './components/HomeHero.svelte';
	import HomeProjectTimeline from './components/HomeProjectTimeline.svelte';
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
	<!-- <HomeHeaderStats /> -->
	<!-- <HomeTabs /> -->
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
