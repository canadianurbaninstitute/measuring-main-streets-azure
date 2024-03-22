<script>
    import '../styles.css'
    import { base } from "$app/paths";
    import Card from '../lib/ui/Card.svelte';

    import Toronto from '../lib/assets/boundaries/Toronto.svg';
    import Montreal from '../lib/assets/boundaries/Montreal.svg';
    import Edmonton from '../lib/assets/boundaries/Edmonton.svg';


</script>


<div class="hero">
    <h1> Case Studies </h1>
	<div class="subtitle">
		<h2>Regions</h2>
	</div>
</div>



<div class="hero">
	<p>
		We conducted case studies across the Toronto, Montreal and Edmonton regions. 30 are full case studies which combine data about the main streets with qualitative observation from site visits, whilst a further 30 are data-only. Click on a region to browse the case studies.
	</p>
</div>

<div class="card-grid">
    <Card
		link={"/casestudies/toronto/"}
		cardImage={Toronto}
		streetName={'Toronto'}
	/>
    <Card
        link={"/casestudies/montreal/"}
        cardImage={Montreal}
		streetName={'Montreal'}
	/>
	<Card
        link={"/casestudies/edmonton/"}
        cardImage={Edmonton}
		streetName={'Edmonton'}
	/>
</div>

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
	}

</style>
