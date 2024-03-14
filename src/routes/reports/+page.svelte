<script>
    import '../styles.css'
	import ReportCard from '../lib/ui/ReportCard.svelte';
	import malls from '../lib/assets/graphics/malls.svg'
	import resiliency from '../lib/assets/graphics/resiliency.svg';
	import civic from '../lib/assets/graphics/civic.svg';
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import Toronto from '../lib/assets/boundaries/Toronto.svg';
    import Montreal from '../lib/assets/boundaries/Montreal.svg';
    import Edmonton from '../lib/assets/boundaries/Edmonton.svg';

	
</script>


<div class="hero">
    <h1> Reports </h1>
	<div class="subtitle">
		<h2>Research Briefs</h2>
	</div>
    <p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
</div>

<div class="card-grid">

	<ReportCard
	link={"/"}
	cardImage={mainstreets}
	title={'The Case for Main Streets'}
	subtitle={'Why main streets matter and their relationship with civic infrastructure'}
	/>


	<ReportCard
	link={"/reports/mainstreets-malls-mice"}
	cardImage={malls}
	title={'Main Streets, Malls & Mice'}
	subtitle={'Trajectories of main streets, shopping malls and online behaviour'}
	/>

	<ReportCard
	link={"/"}
	cardImage={resiliency}
	title={'Resilient Main Streets'}
	subtitle={'Analysing main street resiliency through visitor levels over the pandemic'}
	/>

	<ReportCard
	link={"/"}
	cardImage={civic}
	title={'Main Street Solutions'}
	subtitle={'Idenitfying gaps in main street civic infrastructure '}
	/>
	
</div>

<div class="hero">
	<div class="subtitle">
		<h2>Regional Reports</h2>
	</div>
    <p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
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