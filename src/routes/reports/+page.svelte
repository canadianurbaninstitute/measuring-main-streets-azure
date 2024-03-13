<script>
    import '../styles.css'
	import ReportCard from '../lib/ui/ReportCard.svelte';
	import malls from '../lib/assets/graphics/malls.svg'
	import resiliency from '../lib/assets/graphics/resiliency.svg';
	import mmslogo from '../lib/assets/logos/mms_logo.svg'
	
</script>


<div class="hero">
    <h1> Reports </h1>
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
	cardImage={malls}
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
	cardImage={malls}
	title={'Main Street Solutions'}
	subtitle={'Civic Infrastructure Gap Analysis'}
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

</style>