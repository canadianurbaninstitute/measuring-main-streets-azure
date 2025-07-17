<script>
	import '../styles.css';
	import Card from '../lib/ui/Card.svelte';

	import Toronto from '../lib/assets/boundaries/Toronto.svg';
	import Montreal from '../lib/assets/boundaries/Montreal.svg';
	import Edmonton from '../lib/assets/boundaries/Edmonton.svg';
	import Footer from '../lib/ui/Footer.svelte';
</script>

<div class="hero">
	<h1>Measuring Main Streets Case Studies</h1>
	<p>
		Discover how infrastructure paints a picture of a community through sixty main streets case studies across three Canadian cities.
	</p>
	<p>
		Explore the built form, civic infrastructure, business profile, employment profile, housing, local characteristics, and visitor patterns to get a unique snapshot of how these factors interplay at the neighbourhood scale to influence community outcomes.
	</p>
	<p>With 20 case studies in each of the three regions, 10 are bolstered with qualitative observation from site visits, whilst the remaining 10 are data only. The selected main streets aim to provide a representative sample of types of streets within each regional context. This included four downtown (workplace-oriented), four small town, and 12 neighourhood (residential-oriented) main streets being chosen, with additional emphasis placed on equity-deserving communities.</p>
	<p>Click on a region to browse the case studies.</p>
</div>

<div class="card-grid">
	<Card link={'/casestudies/toronto/'} cardImage={Toronto} streetName={'Toronto'} />
	<Card link={'/casestudies/montreal/'} cardImage={Montreal} streetName={'Montreal'} />
	<Card link={'/casestudies/edmonton/'} cardImage={Edmonton} streetName={'Edmonton'} />
</div>

<div class="collage-image-container">
	<img src="https://i.imgur.com/0xWjVS8.png" alt="region-collage" />
</div>
<Footer />

<style>
	.card-grid {
		display: grid;
		grid-gap: 1em;
		margin: 2em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
		overflow: hidden;
	}

	img {
		width: 100%;
	}

	/*DESKTOP*/

	@media only screen and (min-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.hero {
			margin: 2em 15em 2em 15em;
		}

	}

</style>
