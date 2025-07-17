<script>
    import '../styles.css'
	import Footer from '../lib/ui/Footer.svelte'
	import ReportCard from '../lib/ui/ReportCard.svelte';
	import malls from '../lib/assets/graphics/malls.svg'
	import resiliency from '../lib/assets/graphics/resiliency.svg';
	import civic from '../lib/assets/graphics/civic.svg';
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../lib/assets/graphics/opennorth.svg';
	import Toronto from '../lib/assets/graphics/toronto.jpg';
    import Montreal from '../lib/assets/graphics/montreal.jpg';
    import Edmonton from '../lib/assets/graphics/edmonton.jpg';

	
</script>

<div class="hero">
    <h1> Measuring Main Streets Reports </h1>
	<p>Emerging from the data that underpins the mapping tool, CUI and select partners developed a project executive summary, four research reports, and three regional reports to reveal key findings and messages, enable sensemaking, and point toward real-life applications and interventions.</p>
	<div class="subtitle">
		<h2>Executive Summary</h2>
	</div>
	<p>Learn about the Measuring Main Street project and platform.</p>
</div>


<div class='solo-card'>
	<ReportCard
	link={"/reports/executive-summary"}
	cardImage={mainstreets}
	title={'Executive Summary: Measuring Main Streets'}
	subtitle={''}
	/>
</div>

<div class="hero">
	<div class="subtitle">
		<h2>Research Briefs</h2>
	</div>
    <p>
		Research found that the state of a community’s main streets has direct and tangible impacts on social outcomes –– namely resiliency, equity, and community. In each of these thematic briefs, discover three key findings, and nine messages to city builders.
    </p>
</div>




<div class="card-grid">

	<ReportCard
	link={"/reports/mainstreets-malls-mice"}
	cardImage={malls}
	title={'Main Streets, Malls & Mice'}
	subtitle={'Trajectories of main streets, shopping malls and online behaviour'}
	/>

	<ReportCard
	link={"/reports/mainstreet-resiliency"}
	cardImage={resiliency}
	title={'Main Street Resiliency'}
	subtitle={'Analysing main street resiliency through visitor levels over the pandemic'}
	/>

	<ReportCard
	link={"/reports/mainstreets-infrastructure-equity"}
	cardImage={civic}
	title={'Infrastructure Equity & Main Streets'}
	subtitle={'Idenitfying equity gaps in main street civic infrastructure'}
	/>
	
</div>


<div class="hero">
	<div class="subtitle">
		<h2>Open North Report</h2>
	</div>
    <p>
		This research brief outlines key opportunities for local governments to better integrate data and technology initiatives into the planning of infrastructure investments to address main street challenges. It also highlights examples from local governments who are already strategically integrating data and technology into their city-building work and offers guidance for local government staff seeking to do the same in their communities.
    </p>
</div>

<div class='solo-card'>

<ReportCard
link={"https://canurb.org/wp-content/uploads/Data-Driven-Approaches-to-Main-Street-Challenges.pdf"}
cardImage={opennorth}
title={'Open North: Data Driven Approaches to Main Street Challenges'}
subtitle={'Planning data and technology projects to support smart civic infrastructure investments'}
/>
</div>


<div class="hero">
	<div class="subtitle">
		<h2>Regional Reports</h2>
	</div>
    <p>
		Three regional reports provide a higher-level analysis of Toronto, Montreal and Edmonton main streets based on the sixty case studies. The insights and context provided aim to add depth to the data while tackling implications for the three guiding themes of resiliency, equity, and community.
    </p>
</div>

<div class="card-grid" id="regional">
	
	<ReportCard
	link={"/reports/toronto"}
	cardImage={Toronto}
	title={'Toronto'}
	subtitle={'Ontario'}
	/>


	<ReportCard
	link={"/reports/montreal"}
	cardImage={Montreal}
	title={'Montreal'}
	subtitle={'Québec'}
	/>

	<ReportCard
	link={"/reports/edmonton"}
	cardImage={Edmonton}
	title={'Edmonton'}
	subtitle={'Alberta'}
	/>


	
</div>

<Footer/>

<style>

	p {
		color: var(--brandDarkBlue);
	}

	.card-grid {
		display: grid;
		grid-gap: 1em;
		margin: 2em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
		overflow: hidden;
	}

	#regional {
		grid-template-columns: repeat(1, 1fr);
	}

	.solo-card {
		margin: 2em;
	}

	/* Small devices (portrait tablets and large phones, 600px and up) */
	@media only screen and (min-width: 992px) {
		.card-grid {
			grid-template-columns: repeat(1, 1fr);
		}
	
		#regional {
		grid-template-columns: repeat(3, 1fr);
		}

	}

	@media only screen and (min-width: 768px) {

		.hero {
			margin: 2em 15em 2em 15em;
		}

		.card-grid, .solo-card {
			margin: 2em 15em 2em 15em;
		}


	}
	


</style>