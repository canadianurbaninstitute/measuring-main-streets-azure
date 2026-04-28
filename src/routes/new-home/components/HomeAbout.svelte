<script>
	import Icon from '@iconify/svelte';
	const buttons = [
		{ text: 'About the Platform', href: '/about' },
		{ text: 'About the Project Phases', href: '/about' },
		{ text: 'Canadian Urban Institute', href: 'https://canurb.org/', target: '_blank' }
	];
</script>

<section class="about-section">
	<!-- <div class="map-bg"></div> -->
	<div class="about-content">
		<h2 class="about-title">About Measuring Main Streets</h2>
		<h3 class="about-subtitle">
			Empowering communities with accessible data to make better decisions, stronger investments,
			and measure local outcomes.
		</h3>
		<p class="about-text">
			Canada is a country of Main Streets; they are where small businesses grow, neighbours connect,
			and communities express who they are. But Main Streets serve a challenging dual role as the
			places where pressing challenges—affordability, homelessness, public safety, and more—are
			experienced and addressed, while simultaneously driving economic, social, and civic life for
			entire communities.
		</p>
		<p class="about-text">
			Building on the long-standing work of the <a href="https://canurb.org/" target="_blank"
				>Canadian Urban Institute</a
			> strengthening Main Streets and downtowns in Canada, Measuring Main Streets is a first-of-its-kind
			platform that makes high‑quality data more accessible for community champions, practitioners, and
			decision‑makers to advocate effectively for the main streets they know and serve—grounded in evidence
			that reflects local realities.
		</p>
		<p class="about-text">
			The Measuring Main Streets platform is funded by the Research Knowledge Initiative of Housing,
			Infrastructure and Communities Canada.
		</p>

		<div class="about-buttons">
			{#each buttons as btn}
				<a href={btn.href} class="about-button">{btn.text} <Icon icon="ph:arrow-right-bold" /></a>
			{/each}
		</div>
	</div>
</section>

<style>
	.about-section {
		background-image: url('../../lib/assets/graphics/vancouver-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		padding: 6rem 2rem;
		margin: 0 auto;
		overflow: hidden;
		position: relative;
		width: 100%;
		background-attachment: fixed;
	}

	.about-content {
		z-index: 2;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		padding: 4rem;
		border-radius: 2rem;
	}

	.about-title {
		font-family: 'Gelasio', serif;
		font-size: 2.5rem;
		color: var(--brandDarkBlue);
		margin-bottom: 2rem;
	}

	.about-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #444;
		margin-bottom: 2rem;
		max-width: 600px;
	}

	.about-text {
		max-width: 700px;
	}

	.about-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 3rem;
		max-width: 600px;
	}

	.about-button {
		background-color: var(--brandDarkBlue);
		color: white;
		padding: 1rem;
		border-radius: 2rem;
		text-decoration: none;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		text-align: center;
		transition: background-color 0.2s;
	}

	.about-button:hover {
		background-color: var(--brandLightBlue);
	}
</style>
