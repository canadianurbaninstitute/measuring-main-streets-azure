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
		content="Making Data More Accessible for Main Street & Downtown Vibrancy"
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
