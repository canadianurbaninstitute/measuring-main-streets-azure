<script>
	import Icon from '@iconify/svelte';
	const buttons = [
		{ text: 'Learn more about us', href: '/about' },
		{ text: 'Frequently Asked Questions', href: '/about/faq' },
		{ text: 'Methodology', href: '/about/data-methodology' },
		{ text: 'Contact Us', href: '/about/contact' }
	];
</script>

<section class="about-section">
	<!-- <div class="map-bg"></div> -->
	<div class="about-content">
		<h2 class="about-title">About Measuring Main Streets and CUI</h2>
		<h3 class="about-subtitle">
			Creating a data-driven understanding of Canada's local communities at the scale of the main
			street.
		</h3>
		<p class="about-text">
			The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
			from Housing, Infrastructure and Communities Canada.
		</p>
		<p class="about-text">
			Planners, developers, and municipal leaders often consider investment decisions based on
			individual assets rather than the inter-relationship of civic assets, housing and other uses
			that can be anchored to a main street as the spine of a community. This narrow approach risks
			compromising the liveability of communities by neglecting the scale at which residents and
			visitors understand and experience a neighbourhood.
		</p>
		<p class="about-text">Talk about this from the CUI POV. Why is CUI doing this overall?</p>

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
		background: white;
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
		font-size: 1rem;
		line-height: 1.6;
		color: #666;
		margin-bottom: 1.5rem;
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
