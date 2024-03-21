<script>
	import './styles.css';
	import HeroCard from './lib/ui/HeroCard.svelte';
	import Footer from './lib/Footer.svelte';
	import collage from './lib/assets/graphics/MMS-collage.jpg';
	import SvelteTypedJs from 'svelte-typed-js';
	import Icon from '@iconify/svelte';

	function scrollIntoView({ target }) {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

<div class="splash">
	<img src={collage} alt="collage" id="collage" />
	<div class="splash-text">
		<SvelteTypedJs
			typeSpeed={100}
			backSpeed={100}
			showCursor={false}
			strings={['Measuring', 'Understanding', 'Empowering', 'Unlocking']}
			loop="true"
		>
			<h1 class="typing" />
		</SvelteTypedJs>
		<h1>Main Streets</h1>
		<p>
			Using a data-oriented approach, Measuring Main Streets explores what’s working, what’s not and
			what’s next for Canada’s main streets.
		</p>
		<button on:click|preventDefault={scrollIntoView} href="#get-started"
			>Get Started <Icon icon="ph:arrow-down-bold" /></button
		>
	</div>
</div>

<div class="hero">
	<h1 id="get-started">Quick Links</h1>
</div>

<div class="card-grid">
	<HeroCard
		link={'/map'}
		cardImage={'https://i.imgur.com/6Q7qGU1.jpeg'}
		title={'National Map'}
		subtitle={'Explore main streets on the map'}
	/>

	<HeroCard
		link={'/reports'}
		cardImage={'https://i.imgur.com/PQqqkhl.png'}
		title={'Reports'}
		subtitle={'Read the research briefs'}
	/>

	<HeroCard
		link={'/casestudies'}
		cardImage={'https://i.imgur.com/8WDGwYT.jpeg'}
		title={'Case Studies'}
		subtitle={'Browse case studies across Canada'}
	/>

	<HeroCard
		link={'/tools'}
		cardImage={'https://i.imgur.com/gj9y9QY.png'}
		title={'Tools'}
		subtitle={'Use our tools'}
	/>
</div>

<div class="hero">
	<h1>Why Main Streets?</h1>
	<p>
		Main streets are the backbone of Canadian society. They provide local access to daily
		necessities that are foundational to the well-being of residents. Nearly 30 million of Canadians
		live within one kilometre of a main street. Over 160,000 main street businesses provide 1.7
		million jobs and generate $250 billion in revenue. Beyond the sheer economic power of main
		streets, they also play an essential role in civil society. They are gathering places where
		personal relationships are created and strengthened. To this point, there are over 52,000
		locations of community and civic infrastructure on main streets. Furthermore, dense, walkable
		main streets have positive impacts on environmental sustainability as well as personal health.
		In short, vibrant main streets create thriving neighbourhoods, thriving neighbourhoods produce
		healthy cities, and healthy cities underpin a prosperous country.
	</p>
	<!-- <div id="video-container">
		<iframe width="560" height="315" src="https://www.youtube.com/embed/-MLAgIoDURI?si=SWoIAT7bGVCaCViZ&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
	</div> -->
</div>

<div class="hero">
	<h1>The Canadian Urban Institute</h1>
	<p>
		We are the national platform that houses the best in Canadian city building — where
		policymakers, urban professionals, civic and business leaders, community activists and academics
		can learn, share and collaborate with one another from coast to coast to coast.
	</p>
</div>

<div class="hero">
	<h1>Learn More</h1>
	<p>
        Have questions or enquiries about the project? Read the <a href="/">FAQ and Guide</a>, learn more about our <a href="/about">project and data sources</a>, or our <a href="/">Methodology</a>. You can also reach out to us directly via the <a href='/'>Contact</a> page.
	</p>
</div>

<Footer />

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

	#collage {
		width: 55%;
	}

	.splash {
		display: flex;
		width: 100vw;
		border-bottom: 1px solid #eee;
		align-items: flex-end;
	}

	.splash h1 {
		font-size: 5em;
		margin: 0;
	}

	.splash-text {
		margin: 2em;
		font-family: Helvetica, sans-serif;
	}

	button {
		padding: 1em;
		border-radius: 10em;
		font-size: 1em;
		border: none;
		background-color: var(--brandLightBlue);
		color: white;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	button:hover {
		background-color: var(--brandPink);
	}
</style>
