<script>
    import '../styles.css'
    import { base } from "$app/paths";
    import Card from '../lib/ui/Card.svelte';

    import Toronto from '../lib/assets/boundaries/Toronto.svg';
    import Montreal from '../lib/assets/boundaries/Montreal.svg';
    import Edmonton from '../lib/assets/boundaries/Edmonton.svg';


</script>


<div class="hero">
    <h1> Case Study Regions </h1>
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

    h1 {
        padding-top: 1em;
    }
    
	.card-grid {
		border-radius: 1em;
		display: grid;
		background-color: #ddd;
		border: 1px solid #ddd;
		grid-gap: 1px;
		margin: 3em;
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
