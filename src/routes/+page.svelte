<script>
    import './styles.css'
    import HeroCard from './lib/ui/HeroCard.svelte';
</script>

<div class="hero">
    <h1> Measuring Main Streets Demo </h1>
</div>

<div class="card-grid">

<HeroCard
link={"/map"}
cardImage={'https://i.imgur.com/DXGEpQB.png'}
title={'National Map'}
subtitle={'Explore the national map'}
/>

<HeroCard
link={"/casestudies"}
cardImage={'https://i.imgur.com/DXGEpQB.png'}
title={'Case Studies'}
subtitle={'Explore the case studies'}
/>

</div>

<style>

    h1 {
        padding-top: 1em;
    }

    .card-grid {
		display: grid;
		grid-gap: 1px;
		margin: 1em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
	}

</style>
