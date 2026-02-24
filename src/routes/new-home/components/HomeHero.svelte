<script>
	import hero from '../../lib/assets/graphics/measuring-main-streets-hero.png';
</script>

<section class="hero-container">
	<div class="background"></div>
	<div class="content">
		<img class="hero-image" src={hero} alt="Measuring Main Streets" />
	</div>
</section>

<style>
	.hero-container {
		position: relative;
		width: 100%;
		height: clamp(300px, 60vh, 500px);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #fff;
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
		max-width: 100%;
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
			height: clamp(280px, 50vh, 400px);
		}

		.background {
			background-attachment: scroll;
		}
	}

	/* Tablet (640px - 1024px) */
	@media (min-width: 641px) and (max-width: 1024px) {
		.hero-container {
			height: clamp(350px, 55vh, 450px);
		}
	}

	/* Large screens (> 1024px) */
	@media (min-width: 1025px) {
		.hero-container {
			height: clamp(400px, 60vh, 500px);
		}
	}
</style>
