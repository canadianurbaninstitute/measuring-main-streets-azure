<script>
	import hero from '../../lib/assets/graphics/measuring-main-streets-hero.png';
</script>

<div class="hero-wrapper">
	<div class="background"></div>
	<section class="hero-container">
		<div class="content">
			<img class="hero-image" src={hero} alt="Measuring Main Streets" />
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
		overflow: hidden;
	}

	.hero-container {
		position: relative;
		width: 100%;
		height: clamp(300px, 50vh, 500px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('../../lib/assets/graphics/montreal-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		z-index: 0;
	}

	.content {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		text-align: center;
		padding: clamp(1rem, 4vw, 3rem);
		width: 100%;
	}

	.hero-image {
		width: 100%;
		max-width: clamp(280px, 90vw, 800px);
		height: auto;
		object-fit: contain;
	}

	/* Mobile (< 640px) */
	@media (max-width: 640px) {
		.hero-container {
			height: clamp(250px, 45vh, 350px);
		}

		.background {
			background-attachment: scroll;
		}
	}
</style>
