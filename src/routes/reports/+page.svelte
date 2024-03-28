<script>
    import '../styles.css'
	import Footer from '../lib/Footer.svelte'
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
    <h1> Reports </h1>
	<div class="subtitle">
		<h2>Research Briefs</h2>
	</div>
    <p>
		This set of research briefs and reports aim to provide sensemaking and point towards potential policy interventions relating to Main Streets, tackling issues around equity, resiliency and governance among others.
    </p>
</div>

<div style="margin: 2em">
<ReportCard
link={"/reports/case-for-mainstreets"}
cardImage={mainstreets}
title={'The Case for Main Streets'}
subtitle={'An introduction to Measuring Main Streets'}
/>
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

	<ReportCard
	link={"/"}
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
		These 3 regional reports dive into detail about the specificities of the Toronto, Montreal and Edmonton regions and their relationship to Main Streets, offering deeper insights and crucial context.
    </p>
</div>

<div class="card-grid" id="regional">
	
	<ReportCard
	link={"/"}
	cardImage={Toronto}
	title={'Toronto'}
	subtitle={'Ontario'}
	/>


	<ReportCard
	link={"/"}
	cardImage={Montreal}
	title={'Montreal'}
	subtitle={'Québec'}
	/>

	<ReportCard
	link={"/"}
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
		grid-template-columns: repeat(2, 1fr);
		overflow: hidden;
	}

	#regional {
		grid-template-columns: repeat(3, 1fr);
	}

</style>