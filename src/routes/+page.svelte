<script>
	import './styles.css';
	import HeroCard from './lib/ui/HeroCard.svelte';
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
			Using a data-oriented approach, Measuring Main Streets explores what’s working, what’s not and
			what’s next for Canada’s main streets, helping empower decision makers from the neighbourhood
			to the national scale.
		</p>
		<div class="splash-buttons">
			<button on:click|preventDefault={scrollIntoView} href="#get-started"
				>Explore the Platform <Icon icon="ph:arrow-down-bold" /></button
			>
			<a href="/reports"
				><button id="executive-summary"
					>Read the Executive Summary <Icon icon="ph:arrow-right-bold" /></button
				></a
			>
		</div>
	</div>
</div>

<span id="get-started" />

<div class="hero">
	<h1>Quick Links</h1>
	<p>
		Read the <a href="/about/guide">Measuring Main Streets Guide</a> to understand each component of
		the platform in greater detail, or, jump to a section using the links below.
	</p>
</div>

<div class="card-grid">
	<HeroCard
		link={'/map'}
		cardImage={'https://i.imgur.com/eW8AZ8W.jpeg'}
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
		cardImage={'https://i.imgur.com/8WDGwYT.jpeg'}
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
	<img src="https://i.imgur.com/tAGVMYI.jpeg" alt="lamp" style="height:500px;border-radius:1em;" />
	<div class="hero">
		<h1>Why Main Streets?</h1>
		<h2>Main streets are the backbone of Canadian society.</h2>
		<h3>
			Vibrant main streets create thriving neighbourhoods, thriving neighbourhoods produce healthy
			cities, and healthy cities underpin a prosperous country.
		</h3>

		<p>
			Nearly 75% of Canadians live within one kilometre of a main street. Over 160,000 main street
			businesses provide 1.7 million jobs and generate $250 billion in revenue. Main streets are
			gathering places home to over 50,000 pieces of community and civic infrastrucutre where
			personal relationships are created and strengthened, and dense, walkable main streets have
			positive impacts on environmental sustainability as well as personal health.
		</p>
	</div>
</div>

<div class="section">
	<div class="hero" id="left-hero">
		<h1>Why Now?</h1>
		<h2>Main streets require urgent attention and investment.</h2>
		<h3>
			Main Streets were challenged during the pandemic, and require a more inclusive and innovative
			approach to ensure their resiliency, now more than ever.
		</h3>

		<p>
			Main streets that experienced prolonged stress during the pandemic were highly vulnerable to
			negative cycles of reduced footfall, store vacancies, and diminishing perceptions. Many main
			streets, especially ones closer to city-centres, remain below 2019 visitor levels. Even before
			the pandemic, main streets were experiencing significant challenges from long-running shifts
			to online and big-box consumer behaviour. Our main streets must be cherished and invested in
			if our country is going to flourish.
		</p>
	</div>

	<img
		src="https://i.imgur.com/EcU0Gd0.jpeg"
		alt="crossroads"
		style="height:500px;border-radius:1em;"
	/>
</div>

<div class="section">
	<svg
		width="110px"
		height="126px"
		viewBox="0 0 110 126"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g id="cui" stroke="#002940" stroke-width="1.61691499">
				<path
					d="M59.1068814,0 L59.1068814,20.1664533 C59.1068814,22.2637644 60.7174231,23.8770807 62.8111274,23.8770807 C64.9048316,23.8770807 66.5153734,22.2637644 66.5153734,20.1664533 L66.5153734,0"
					id="Path"
				/>
				<path
					d="M66.6764275,126 L66.6764275,105.833547 C66.6764275,103.736236 65.0658858,102.122919 62.9721816,102.122919 C60.8784773,102.122919 59.2679356,103.736236 59.2679356,105.833547 L59.2679356,126"
					id="Path"
				/>
				<path
					d="M35.2708638,6.29193342 L43.0014641,24.8450704 C43.806735,26.7810499 46.0614934,27.7490397 47.9941435,26.9423816 C49.9267936,26.1357234 50.8931186,23.8770807 50.0878477,21.9411012 L42.3572474,3.38796415"
					id="Path"
				/>
				<path
					d="M90.3513909,119.708067 L82.6207906,101.15493 C81.8155198,99.2189501 79.5607613,98.2509603 77.6281113,99.0576184 C75.6954612,99.8642766 74.7291362,102.122919 75.534407,104.058899 L83.4260615,122.612036"
					id="Path"
				/>
				<path
					d="M15.7833089,21.134443 L29.9560761,35.3316261 C31.4055637,36.7836108 33.8213763,36.7836108 35.2708638,35.3316261 C36.7203514,33.8796415 36.7203514,31.4596671 35.2708638,30.0076825 L21.0980966,15.8104994"
					id="Path"
				/>
				<path
					d="M110,104.865557 L95.8272328,90.6683739 C94.3777452,89.2163892 91.9619327,89.2163892 90.5124451,90.6683739 C89.0629575,92.1203585 89.0629575,94.5403329 90.5124451,95.9923175 L104.685212,110.189501"
					id="Path"
				/>
				<path
					d="M3.38213763,42.4302177 L21.9033675,50.0128041 C23.8360176,50.8194622 26.090776,49.8514725 26.8960469,47.915493 C27.7013177,45.9795134 26.7349927,43.7208707 24.8023426,42.9142125 L6.28111274,35.3316261"
					id="Path"
				/>
				<path
					d="M0,66.7912932 L20.1317716,66.7912932 C22.2254758,66.7912932 23.8360176,65.177977 23.8360176,63.0806658 C23.8360176,60.9833547 22.2254758,59.3700384 20.1317716,59.3700384 L0,59.3700384"
					id="Path"
				/>
				<path
					d="M6.28111274,90.5070423 L24.8023426,82.7631242 C26.7349927,81.9564661 27.7013177,79.6978233 26.8960469,77.7618438 C26.090776,75.8258643 23.8360176,74.8578745 21.9033675,75.6645327 L3.38213763,83.5697823"
					id="Path"
				/>
				<path
					d="M21.0980966,110.189501 L35.2708638,95.9923175 C36.7203514,94.5403329 36.7203514,92.1203585 35.2708638,90.6683739 C33.8213763,89.2163892 31.4055637,89.2163892 29.9560761,90.6683739 L15.7833089,104.865557"
					id="Path"
				/>
				<path
					d="M104.685212,15.8104994 L90.5124451,30.0076825 C89.0629575,31.4596671 89.0629575,33.8796415 90.5124451,35.3316261 C91.9619327,36.7836108 94.3777452,36.7836108 95.8272328,35.3316261 L110,21.134443"
					id="Path"
				/>
				<path
					d="M42.3572474,122.612036 L49.9267936,104.058899 C50.7320644,102.122919 49.7657394,99.8642766 47.8330893,99.0576184 C45.9004392,98.2509603 43.6456808,99.2189501 42.84041,101.15493 L35.1098097,119.708067"
					id="Path"
				/>
				<path
					d="M83.4260615,3.38796415 L75.6954612,21.9411012 C74.8901903,23.8770807 75.8565154,26.1357234 77.7891654,26.9423816 C79.7218155,27.7490397 81.9765739,26.7810499 82.7818448,24.8450704 L90.5124451,6.29193342"
					id="Path"
				/>
			</g>
		</g>
	</svg>

	<div class="hero">
		<h1>The Canadian Urban Institute</h1>
		<p>
			We are the national platform that houses the best in Canadian city building — where
			policymakers, urban professionals, civic and business leaders, community activists and
			academics can learn, share and collaborate with one another from coast to coast to coast.
		</p>
	</div>
</div>
<div class="section">
	<div class="hero">
		<h1>Learn More</h1>
		<p>
			Have questions or enquiries about the platform? Read the <a href="/">FAQ</a>, learn more about
			the <a href="/about">Platform</a>, or read our <a href="/">Methodology & Data Sources</a>. You
			can also reach out to us directly via the <a href="/">Contact</a> page.
		</p>
	</div>
</div>

<div class="section" id="stronger-together">
	<div class="hero">
		<h1>Canada is Stronger Together</h1>
		<p>
			The Measuring Main Streets platform was realized through the Research Knowledge Initiative
			program from Infrastructure Canada. We leveraged partners at Environics Analytics and Open
			North to produce the first ever national-scale main street assessment platform in the face of
			urgent needs across the country.
		</p>
	</div>
	<div class="logo-group">
		<img src={canada_logo} alt="Canadian Urban Institute" />
		<a href="https://www.canurb.org"><img src={cui_logo} alt="Canadian Urban Institute" /></a>
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

	svg {
		width: auto; /* Make sure SVG scales with the container */
		height: 100%; /* Fill the entire height of its container */
		max-height: 100%; /* Ensure SVG does not exceed the height of its container */
	}

	a {
		text-decoration: none;
		color: var(--brandLightBlue);
	}

	.hero {
		margin: 2em;
		gap: 1em;
		flex: 1;
	}



	.section {
		display: flex;
		flex-direction: column;
		padding: 2em;
		align-items: center;
		border-bottom: 1px solid var(--brandGrey);
	}

	#why-main-streets {
		border-top: 1px solid var(--brandGrey);
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

		#left-hero {
			margin: 0 2em 0 0;
		}
	}
</style>
