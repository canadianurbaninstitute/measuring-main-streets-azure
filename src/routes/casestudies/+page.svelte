<script>
	import '../styles.css';
	import { base } from '$app/paths';
	import Card from '../lib/ui/Card.svelte';

	import Toronto from '../lib/assets/boundaries/Toronto.svg';
	import Montreal from '../lib/assets/boundaries/Montreal.svg';
	import Edmonton from '../lib/assets/boundaries/Edmonton.svg';
	import Footer from '../lib/Footer.svelte';
</script>

<div class="hero">
	<h1>Case Studies</h1>
	<div class="subtitle">
		<h2>Regions</h2>
	</div>
</div>

<div class="hero">
	<p>
		We conducted 60 case studies in total across the Toronto, Montreal and Edmonton regions, 20 in each region. 10 of the 20 are full case
		studies which combine data about the main streets with qualitative observation from site visits,
		whilst the further 10 are data-only. The 20 main streets were intended to provide a representative sample of types of streets within each
		regional context. This included four downtown (workplace-oriented), four small town, and 12
		neighourhood (residential-oriented) main streets being chosen, with additional emphasis placed on
		equity-deserving communities. More streets were included in the neighbourhood category as there
		are a greater variety of streets within the group. Click on a region to browse the case studies.
	</p>
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

	/*DESKTOP*/

	@media only screen and (min-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		p {
			max-width: 80%;
		}
	}

	img {
		width: 100%;
	}
</style>
