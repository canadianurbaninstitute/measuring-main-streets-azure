<script>
    import './styles.css'
    import HeroCard from './lib/ui/HeroCard.svelte';
    import Footer from './lib/Footer.svelte'
</script>

<div class="hero">
    <h1> Measuring Main Streets </h1>
</div>

<div class="card-grid">

<HeroCard
link={"/map"}
cardImage={'https://i.imgur.com/6Q7qGU1.jpeg'}
title={'National Map'}
subtitle={'Explore main streets on the map'}
/>



<HeroCard
link={"/reports"}
cardImage={'https://i.imgur.com/kNqQwYA.png'}
title={'Reports'}
subtitle={'Read the reports'}
/>

<HeroCard
link={"/casestudies"}
cardImage={'https://i.imgur.com/8WDGwYT.jpeg'}
title={'Case Studies'}
subtitle={'Browse the case studies'}
/>


<HeroCard
link={"/tools"}
cardImage={'https://i.imgur.com/gj9y9QY.png'}
title={'Tools'}
subtitle={'Use our tools'}
/>

</div>

<div class="hero">
    <h1> Why Main Streets? </h1>
    <div id="video-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/-MLAgIoDURI?si=SWoIAT7bGVCaCViZ&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
</div>

<div class="hero">
    <h1> The Canadian Urban Institute </h1>
   <p>We are the national platform that houses the best in Canadian city building — where policymakers, urban professionals, civic and business leaders, community activists and academics can learn, share and collaborate with one another from coast to coast to coast. </p>
</div>

<div class="hero">
    <h1> Learn More </h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
						nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
						esse cillum dolore eu fugiat nulla pariatur.</p>
</div>


<Footer/>

<style>

    h1 {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        color: var(--brandDarkBlue);
        font-size: 2em;
        margin: 0;
        letter-spacing: -0.1rem;
    }

    .hero {
        margin: 2em;
    }

    #video-container {
        display: flex;
        flex-direction: row;
        margin: 2em 0 0 0;
    }

    .card-grid {
		display: grid;
		grid-gap: 1px;
		margin: 1em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(4, 1fr);
	}

</style>
