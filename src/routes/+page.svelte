<script>
	import './styles.css';
	import HeroCard from './lib/ui/HeroCard.svelte';
	import Footer from './lib/Footer.svelte';
	import collage from './lib/assets/graphics/MMS-collage.jpg';
	import Icon from '@iconify/svelte';
	import Typewriter from 'svelte-typewriter'


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
		<Typewriter mode={'loop'} cursor={false}>
			<h1>Measuring</h1>
			<h1>Understanding</h1>
			<h1>Empowering</h1>
			<h1>Unlocking</h1>
		</Typewriter>
		<h1>Main Streets</h1>
		<p>
			Using a data-oriented approach, Measuring Main Streets explores what’s working, what’s not and
			what’s next for Canada’s main streets, helping empower decision makers from the neighbourhood to the national scale.
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

<div class="section">
	<svg width="162.8px" height="287.9px" viewBox="0 0 162.8 287.9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<g id="lamp" fill-rule="nonzero">
				<path d="M113.9,60.9 L101.9,60.9 L101.9,47.9 L61.9,47.9 L61.9,60.9 L49.9,60.9 L49.9,73.9 L50.3,73.9 L50.2,73.9 L62,116.9 L61.9,116.9 L61.9,129.9 L73.9,129.9 L73.9,213.9 L67.9,213.9 L67.9,226.9 L73.9,226.9 L73.9,253.9 L62.4,253.9 L57.4,287.9 L106.4,287.9 L101.4,253.9 L89.9,253.9 L89.9,226.9 L95.9,226.9 L95.9,213.9 L89.9,213.9 L89.9,129.9 L101.9,129.9 L101.9,116.9 L101.8,116.9 L113.6,73.9 L113.5,73.9 L113.9,73.9 L113.9,60.9 L113.9,60.9 Z M70,116.9 L58.2,73.9 L78.1,73.9 L78.1,116.9 L70,116.9 Z M93.8,116.9 L85.7,116.9 L85.7,73.9 L105.6,73.9 L93.8,116.9 Z" id="post" fill="#002940"></path>
				<path d="M33.9,80 C36,80 37.8,81.7 37.8,83.9 C37.8,86.03125 36.1107422,87.6932617 34.0959503,87.7950562 L33.9,87.8 L3.9,87.8 C1.8,87.8 0,86.1 0,83.9 C0,81.7 1.7,80 3.9,80 L33.9,80 Z M23.8,20.8 L38.4,35.4 C39.9,36.9 39.9,39.3 38.4,40.9 C37.6615385,41.5461538 36.7526627,41.9366864 35.9093309,41.9929449 L35.7,42 C34.7,42 33.7,41.6 33,40.9 L18.4,26.3 C16.9,24.8 16.9,22.4 18.4,20.8 C19.1241379,20.0758621 20.0580262,19.701308 20.9991472,19.6763377 L21.2008528,19.6763377 C22.1419738,19.701308 23.0758621,20.0758621 23.8,20.8 Z M38.4,128.9 C39.9,130.4 39.9,132.8 38.4,134.4 L23.8,148.9 C23.1538462,149.546154 22.252071,149.936686 21.3306327,149.992945 L21.1,150 C20.1,150 19.1,149.6 18.4,148.9 C16.9,147.4 16.9,145 18.4,143.5 L33,128.9 C33.7241379,128.175862 34.6580262,127.801308 35.5991472,127.776338 L35.8008528,127.776338 C36.7419738,127.801308 37.6758621,128.175862 38.4,128.9 Z M158.9,87.8 L128.9,87.8 C126.8,87.8 125,86.1 125,83.9 C125,81.7 126.7,80 128.9,80 L158.9,80 C161,80 162.8,81.7 162.8,83.9 C162.8,86.1 161,87.8 158.9,87.8 Z M141.7,148.1 C140.7,148.1 139.7,147.7 139,147 L124.4,132.4 C122.9,130.9 122.9,128.5 124.4,126.9 C125.9,125.4 128.3,125.4 129.8,126.9 L144.4,141.5 C145.9,143 145.9,145.4 144.4,147 C143.7,147.7 142.7,148.1 141.7,148.1 Z M127.2,40.1 C126.2,40.1 125.2,39.7 124.5,39 C123,37.5 123,35.1 124.5,33.5 L139,18.9 C140.5,17.4 142.9,17.4 144.4,18.9 C145.9,20.4 145.9,22.8 144.4,24.4 L129.9,38.9 C129.1,39.7 128.1,40.1 127.2,40.1 Z M81.9,26.8 C79.8,26.8 78,25.1 78,22.9 L78,3.9 C78,1.8 79.7,0 81.9,0 C84.1,0 85.8,1.7 85.8,3.9 L85.8,22.9 C85.8,25 84,26.8 81.9,26.8 Z" id="light" fill="#58E965"></path>
			</g>
	</svg>
	<div class="hero">
	<h1>Why Main Streets?</h1>
    <h2>Main streets are the backbone of Canadian society.</h2>
	<h3>Vibrant main streets create thriving neighbourhoods, thriving neighbourhoods produce
		healthy cities, and healthy cities underpin a prosperous country.</h3>

	<p>
		Nearly 75% of Canadians live within one kilometre of a main street. Over 160,000 main street businesses provide 1.7
		million jobs and generate $250 billion in revenue. 
		
		Main streets are gathering places home to over 50,000 pieces of community and civic infrastrucutre where personal relationships are created and strengthened, and dense, walkable
		main streets have positive impacts on environmental sustainability as well as personal health.
	</p>
	</div>
</div>

<div class='section'>
<div class="hero">

	<h1>Why Now?</h1>
    <h2>Main streets require urgent attention and investment.</h2>
	<h3>Main Streets were challenged during the pandemic, and require a more inclusive and innovative approach to ensure their resiliency, now more than ever. </h3>

	<p>
		It is vital to undersand how to create and maintain vibrant, resilient main streets to ensure the prosperity of our communities, especially those that are equity deserving or currently underserved.
		
		A variety of factors play a key role, including but not limited to civic infrastructure, housing, green spaces, business mix, and local businesses and resident associations.
	</p>
</div>

<svg width="154.998421px" height="150px" viewBox="0 0 154.998421 150" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="crossroad" fill-rule="nonzero">
            <path d="M32.3629794,94.7367507 L6.94732687,94.7367507 C4.76727848,94.7367507 3,92.969462 3,90.7894006 C3,88.6093391 4.76727848,86.8417022 6.94732687,86.8417022 L36.7159661,86.8417022 C36.8787216,86.8398897 37.0434106,86.8477631 37.2093611,86.8662075 C39.3760681,87.1070227 40.9373131,89.0587157 40.696499,91.2254351 L34.5544584,146.488336 C34.3136444,148.655057 32.3619628,150.216311 30.1952557,149.975495 C28.0285486,149.73468 26.4673037,147.782987 26.7081178,145.616267 L32.3629794,94.7367507 L32.3629794,94.7367507 Z M119.284034,86.8417022 L149.052673,86.8417022 C151.232722,86.8417022 153,88.6093391 153,90.7894006 C153,92.969462 151.232722,94.7367507 149.052673,94.7367507 L123.63702,94.7367507 L129.291882,145.616267 C129.532696,147.782987 127.971451,149.73468 125.804744,149.975495 C123.638037,150.216311 121.686356,148.655057 121.445542,146.488336 L115.303501,91.2254351 C115.062687,89.0587157 116.623932,87.1070227 118.790639,86.8662075 C118.95659,86.8477631 119.121278,86.8398897 119.284034,86.8417022 L119.284034,86.8417022 Z M41.9858778,47.3688982 L6.94732687,47.3688982 C4.76727848,47.3688982 3,45.6012608 3,43.4211995 C3,41.2411383 4.76727848,39.4738494 6.94732687,39.4738494 L38.5008221,39.4738494 L42.4998183,3.51144227 C42.7407546,1.34473604 44.6925242,-0.216407841 46.8592178,0.0245298824 C49.0259113,0.265467605 50.587046,2.21724875 50.3461097,4.38395506 L45.9566822,43.8574559 C45.7302484,45.8937423 43.9927422,47.395173 41.9858778,47.3688982 L41.9858778,47.3688982 Z M117.497571,39.4738494 L149.051094,39.4738494 C151.231143,39.4738494 152.998421,41.2411383 152.998421,43.4211995 C152.998421,45.6012608 151.231143,47.3685496 149.051094,47.3685496 L113.525152,47.3685496 C113.340683,47.3685496 113.171822,47.3120229 113.018571,47.2085357 C111.455919,46.8250011 110.224248,45.5020729 110.036184,43.8098294 L105.654651,4.38369674 C105.413857,2.21697465 106.975121,0.26529629 109.14183,0.0245012247 C111.30854,-0.21629392 113.260206,1.34497841 113.501,3.51170058 L117.497571,39.4738494 Z" id="Shape" fill="#002940"></path>
            <path d="M81.9465374,142.157602 C81.9465374,144.337663 80.1792592,146.104952 77.9992105,146.104952 C75.8191619,146.104952 74.0518837,144.337663 74.0518837,142.157602 L74.0518837,134.262901 C74.0518837,132.08284 75.8191619,130.315551 77.9992105,130.315551 C80.1792592,130.315551 81.9465374,132.08284 81.9465374,134.262901 L81.9465374,142.157602 Z" id="Path" fill="#00ADF2"></path>
            <path d="M81.9465374,118.473501 C81.9465374,120.653563 80.1792592,122.420851 77.9992105,122.420851 C75.8191619,122.420851 74.0518837,120.653563 74.0518837,118.473501 L74.0518837,110.578801 C74.0518837,108.398739 75.8191619,106.631451 77.9992105,106.631451 C80.1792592,106.631451 81.9465374,108.398739 81.9465374,110.578801 L81.9465374,118.473501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M81.9465374,94.7894006 C81.9465374,96.969462 80.1792592,98.7367507 77.9992105,98.7367507 C75.8191619,98.7367507 74.0518837,96.969462 74.0518837,94.7894006 L74.0518837,86.8947004 C74.0518837,84.714639 75.8191619,82.9473503 77.9992105,82.9473503 C80.1792592,82.9473503 81.9465374,84.714639 81.9465374,86.8947004 L81.9465374,94.7894006 Z" id="Path" fill="#00ADF2"></path>
            <path d="M81.9465374,71.1053001 C81.9465374,73.2853615 80.1792592,75.0526501 77.9992105,75.0526501 C75.8191619,75.0526501 74.0518837,73.2853615 74.0518837,71.1053001 L74.0518837,63.2105999 C74.0518837,61.0305387 75.8191619,59.2632498 77.9992105,59.2632498 C80.1792592,59.2632498 81.9465374,61.0305387 81.9465374,63.2105999 L81.9465374,71.1053001 Z" id="Path" fill="#00ADF2"></path>
            <path d="M81.9465374,47.4211995 C81.9465374,49.6012608 80.1792592,51.3685496 77.9992105,51.3685496 C75.8191619,51.3685496 74.0518837,49.6012608 74.0518837,47.4211995 L74.0518837,39.5264994 C74.0518837,37.3464381 75.8191619,35.5791493 77.9992105,35.5791493 C80.1792592,35.5791493 81.9465374,37.3464381 81.9465374,39.5264994 L81.9465374,47.4211995 Z" id="Path" fill="#00ADF2"></path>
            <path d="M81.9465374,23.737099 C81.9465374,25.9171602 80.1792592,27.6844491 77.9992105,27.6844491 C75.8191619,27.6844491 74.0518837,25.9171602 74.0518837,23.737099 L74.0518837,15.8423988 C74.0518837,13.6623376 75.8191619,11.8950487 77.9992105,11.8950487 C80.1792592,11.8950487 81.9465374,13.6623376 81.9465374,15.8423988 L81.9465374,23.737099 Z" id="Path" fill="#00ADF2"></path>
            <path d="M3.94732687,71.0526501 C1.76727848,71.0526501 0,69.2853615 0,67.1053001 C0,64.9252386 1.76727848,63.15795 3.94732687,63.15795 L11.8419806,63.15795 C14.022029,63.15795 15.7893075,64.9252386 15.7893075,67.1053001 C15.7893075,69.2853615 14.022029,71.0526501 11.8419806,71.0526501 L3.94732687,71.0526501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M27.6312881,71.0526501 C25.4512397,71.0526501 23.6839612,69.2853615 23.6839612,67.1053001 C23.6839612,64.9252386 25.4512397,63.15795 27.6312881,63.15795 L35.5259418,63.15795 C37.7059902,63.15795 39.4732687,64.9252386 39.4732687,67.1053001 C39.4732687,69.2853615 37.7059902,71.0526501 35.5259418,71.0526501 L27.6312881,71.0526501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M51.6312881,71.0526501 C49.4512397,71.0526501 47.6839612,69.2853615 47.6839612,67.1053001 C47.6839612,64.9252386 49.4512397,63.15795 51.6312881,63.15795 L59.5259418,63.15795 C61.7059902,63.15795 63.4732687,64.9252386 63.4732687,67.1053001 C63.4732687,69.2853615 61.7059902,71.0526501 59.5259418,71.0526501 L51.6312881,71.0526501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M119.472479,71.0526501 C117.292431,71.0526501 115.525152,69.2853615 115.525152,67.1053001 C115.525152,64.9252386 117.292431,63.15795 119.472479,63.15795 L127.367133,63.15795 C129.547182,63.15795 131.31446,64.9252386 131.31446,67.1053001 C131.31446,69.2853615 129.547182,71.0526501 127.367133,71.0526501 L119.472479,71.0526501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M96.4724792,71.0526501 C94.2924306,71.0526501 92.5251524,69.2853615 92.5251524,67.1053001 C92.5251524,64.9252386 94.2924306,63.15795 96.4724792,63.15795 L104.367133,63.15795 C106.547182,63.15795 108.31446,64.9252386 108.31446,67.1053001 C108.31446,69.2853615 106.547182,71.0526501 104.367133,71.0526501 L96.4724792,71.0526501 Z" id="Path" fill="#00ADF2"></path>
            <path d="M143.15644,71.0526501 C140.976392,71.0526501 139.209114,69.2853615 139.209114,67.1053001 C139.209114,64.9252386 140.976392,63.15795 143.15644,63.15795 L151.051094,63.15795 C153.231143,63.15795 154.998421,64.9252386 154.998421,67.1053001 C154.998421,69.2853615 153.231143,71.0526501 151.051094,71.0526501 L143.15644,71.0526501 Z" id="Path" fill="#00ADF2"></path>
        </g>
    </g>
</svg>
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
        Have questions or enquiries about the project? Read the <a href="/">FAQ</a>, learn more about the <a href="/about">Project</a>, or read our <a href="/">Methodology & Data Sources</a>. You can also reach out to us directly via the <a href='/'>Contact</a> page.
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

	svg {
      width: auto; /* Make sure SVG scales with the container */
      height: 100%; /* Fill the entire height of its container */
      max-height: 100%; /* Ensure SVG does not exceed the height of its container */
    }

	p {
		margin-top: 0;
	}

	.hero {
		margin: 3em;
        gap: 1em;
		flex: 1;
	}

	.section {
		display: flex;
		padding: 2em;
		align-items: center;
		border-top: 1px solid var(--brandGrey);
		border-bottom: 1px solid var(--brandGrey)

	}

	/* #video-container {
		display: flex;
		flex-direction: row;
		margin: 2em 0 0 0;
	} */

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
