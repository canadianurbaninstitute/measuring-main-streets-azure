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
</div>

<div class="subtitle">
	<h2>Case Study Regions</h2>
</div>

<div class="hero">
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
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
