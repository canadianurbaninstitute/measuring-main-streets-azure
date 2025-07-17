<script>
	import './styles.css';
	import HeroCard from './lib/ui/HeroCard.svelte';
	import HeroStat from './lib/ui/HeroStat.svelte';
	import Footer from './lib/Footer.svelte';
	import collage from './lib/assets/graphics/MMS-collage.jpg';
	import canada_logo from './lib/assets/logos/canada_logo.svg';
	import cui_logo from './lib/assets/logos/cui_logo_white.svg';
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
		<h1>Measuring</h1>
		<h1>Main Streets</h1>
		<p>
			Using a data-driven approach, Measuring Main Streets explores what’s working, what’s not and
			what’s next for Canada’s main streets, empowering city builders from the neighbourhood
			to the national scale.
		</p>
		<div class="splash-buttons">
			<button on:click|preventDefault={scrollIntoView} href="#get-started"
				>Explore the Platform <Icon icon="ph:arrow-down-bold" /></button
			>
			<a href="/reports/executive-summary"
				><button id="executive-summary"
					>Read the Executive Summary <Icon icon="ph:arrow-right-bold" /></button
				></a
			>
		</div>
	</div>
</div>

<span id="get-started" />

<div class="card-grid">
	<HeroCard
		link={'/map'}
		cardImage={'https://i.imgur.com/c9WT7dM.png'}
		title={'Main Street Map'}
		subtitle={''}
	/>

	<HeroCard
		link={'/reports'}
		cardImage={'https://i.imgur.com/JOQ6NAp.png'}
		title={'Reports'}
		subtitle={''}
	/>

	<HeroCard
		link={'/casestudies'}
		cardImage={'https://i.imgur.com/89GpAIS.png'}
		title={'Case Studies'}
		subtitle={''}
	/>

	<HeroCard
		link={'/tools'}
		cardImage={'https://i.imgur.com/xoJuf8K.png'}
		title={'Tools'}
		subtitle={''}
	/>
</div>

<div class="section" id="why-main-streets">
	<div class="hero">
		<h1>Why Main Streets?</h1>
		<h2>Main streets are the backbone of Canadian society.</h2>
		<h3>
			Vibrant main streets create thriving neighbourhoods, thriving neighbourhoods produce healthy
			cities, and healthy cities underpin a prosperous country.
		</h3>
		<div class="stat-container">
		<HeroStat
		number={'85%'}
		subtitle={'of Canadians live within 1km of a main street'}
		/>
		<HeroStat
		number={'280,000'}
		subtitle={'Main Street Businesses'}
		/>
		<HeroStat
		number={'1.9 million'}
		subtitle={'jobs provided'}
		/>
		<HeroStat
		number={'$300 billion'}
		subtitle={'in annual revenue'}
		/>
		<HeroStat
		number={'98,000'}
		subtitle={'civic infrastructure & community assets'}
		/>
		</div>
	</div>
</div>

<div class="section" id="why-now">
	<div class="hero" >
		<h1>Why Now?</h1>
		<h2>Main streets require urgent attention and investment.</h2>
		<h3>
			Across three key social themes, we found that main street scale investments offer high-impact oppurtunities to effect change in Canadians' lives. When compared to the 'traditional' way of investment based on asset class, this new model founded in a neighbourhood context enables meaningful change.
		</h3>
		<div class="stat-container">
			<HeroStat
			number={'Equity'}
			subtitle={''}
			color={'var(--brandDarkBlue)'}
			/>
			<HeroStat
			number={'Resiliency'}
			subtitle={''}
			color={'var(--brandDarkBlue)'}
			/>
			<HeroStat
			number={'Community'}
			subtitle={''}
			color={'var(--brandDarkBlue)'}
			/>
			</div>
	</div>
</div>

<div class="section" id="stronger-together">
	<div class="hero">
		<h1>Canada is Stronger Together</h1>
		<p>
			The Measuring Main Streets platform was realized through the Research Knowledge Initiative
			program from Housing, Infrastructure and Communities Canada. The Canadian Urban Institute leveraged partners at Environics Analytics and Open
			North to produce the first ever national-scale main street assessment platform in the face of
			urgent needs across the country.
		</p>
	</div>
	<div class="logo-group">
		<img src={canada_logo} alt="Canadian Urban Institute" />
		<a href="https://www.canurb.org"><img src={cui_logo} alt="Canadian Urban Institute" /></a>
	</div>
</div>
<div class="section">
	<div class="hero" id='learn-more'>
		<div>
		<h1>Discover Canada's Main Streets</h1>
		</div>
		<div style="display: flex; flex-direction: column;">
		<h2>Frequently Asked Questions</h2>
		<p>
			Have questions or enquiries about the platform? Read the <a href="/about/faq">FAQ</a> or learn more about
			the <a href="/about">Platform</a>.
		</p>
		<h2>Methodology and Data</h2>
		<p> Read our <a href="/about/data-methodology">Methodology & Data Sources</a>.</p>
		<h2>Contact Us</h2>
		<p> You can also reach out to us directly via the <a href="/about/contact">Contact</a> page.</p>
		</div>
	</div>
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


	a {
		text-decoration: none;
		color: var(--brandLightBlue);
	}

	.hero {
		margin: 2em 2em 0 2em;
		gap: 1em;
		flex: 1;
		align-items: center;

	}

	.section {
		display: flex;
		flex-direction: column;
		padding: 2em;
		align-items: center;
		/* border-bottom: 1px solid var(--brandGrey); */
	}

	#why-main-streets {
		border-top: 1px solid var(--brandGrey);
		background: linear-gradient(
	rgba(0, 41, 64, 0.8),
	rgba(0, 41, 64, 0.8)), url('https://i.imgur.com/XtcX0Gn.jpeg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		padding: 8em 0 8em 0;
	}

	#why-main-streets h1, #why-main-streets h2, #why-main-streets h3 {
		color:white;
		text-align: center;
	}

	h3 { 
		max-width: 70%;
	}

	.stat-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center
	}

	#why-now {
		text-align: center;
		padding: 8em 0 8em 0;
		background: linear-gradient(
	rgba(83, 233, 101, 0.8),
	rgba(83, 233, 101, 0.8)), url('https://i.imgur.com/acrIbnP.jpeg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	#stronger-together {
		background-color: var(--brandLightBlue);
		border: none;
		flex-direction: column;
		text-align: center;
	}

	#stronger-together h1 {
		margin: 0 auto;
	}

	.logo-group {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}

	.card-grid {
		display: grid;
		grid-gap: 1px;
		margin: 1em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
	}

	.splash {
		display: flex;
		flex-direction: column;
		width: 100vw;
		border-bottom: 1px solid #eee;
		align-items: stretch;
	}

	h3 {
		margin: 0;
	}

	.splash-text {
		margin: 2em;
		font-family: Helvetica, sans-serif;
	}

	.splash-buttons {
		display: flex;
		gap: 1em;
		margin-top: 1em;
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
		cursor: pointer;
	}

	/* Small devices (portrait tablets and large phones, 600px and up) */
	@media only screen and (min-width: 600px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	
		.logo-group {
			flex-direction: row;
		}
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(4, 1fr);
		}

		.section {
		flex-direction: row;
		padding: 2em 10em 2em 10em;
		}


	.stat-container {
		flex-direction: row;
	}

	#learn-more {
		flex-direction: row;
	}

	#learn-more h1 {
		font-size: 3rem;
	}

}

	/* Large devices (laptops/desktops, 992px and up) */
	@media only screen and (min-width: 992px) {
		.splash {
			flex-direction: row;
			align-items: flex-end;
		}

		.splash h1 {
			font-size: 5vw;
			margin: 0;
		}

		#collage {
			width: 50%;
		}

	}
</style>
