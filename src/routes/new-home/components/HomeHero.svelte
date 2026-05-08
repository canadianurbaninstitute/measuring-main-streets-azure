<script>
	import { page } from '$app/stores';
	import heroFr from '../../lib/assets/graphics/measuring-main-streets-hero-fr.png';
	import heroEn from '../../lib/assets/graphics/measuring-main-streets-hero.png';
	import HomeHeaderStats from './HomeHeaderStats.svelte';

	$: isFrench = $page.url.pathname.startsWith('/fr');
	$: currentHero = isFrench ? heroFr : heroEn;
</script>

<div class="hero-wrapper">
	<!-- Background is now a sibling that fills the absolute space of wrapper -->
	<div class="background"></div>

	<section class="hero-container">
		<div class="hero-content">
			<img class="hero-image" src={currentHero} alt="Measuring Main Streets" />
		</div>

		<div class="stats-wrapper">
			<HomeHeaderStats />
		</div>
	</section>

	<div class="tabs-overlay">
		<!-- <HomeTabs /> -->
	</div>
</div>

<style>
	.hero-wrapper {
		position: relative;
		width: 100%;
		/* Remove overflow: hidden if you want shadows to be visible */
		min-height: 400px;
		display: flex;
		flex-direction: column;
	}

	.background {
		position: absolute;
		inset: 0; /* Shorthand for top/left/right/bottom: 0 */
		background-image: url('../../lib/assets/graphics/montreal-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		z-index: 0;
	}

	.hero-container {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1200px; /* Standard container width */
		margin: 0 auto;
		padding: clamp(2rem, 8vw, 3rem) 1rem; /* More vertical breathing room */

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem; /* Space between image and stats */
	}

	.hero-content {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.hero-image {
		width: 100%;
		max-width: 800px;
		height: auto;
		margin-top: 2rem;
		filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
	}

	.stats-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	/* Responsive Adjustments */
	@media (max-width: 768px) {
		.hero-container {
			padding: 3rem 1rem;
			gap: 1.5rem;
		}

		.background {
			background-attachment: scroll; /* Better performance/behavior on mobile */
		}
	}

	/* Small Mobile Fix */
	@media (max-width: 480px) {
		.hero-container {
			padding-top: 2rem;
		}
	}
</style>
