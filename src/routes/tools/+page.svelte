<script>
	import '../styles.css';
	import ReportCard from '../lib/ui/ReportCard.svelte';
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../lib/assets/graphics/opennorth.svg';
</script>

<div class="hero">
	<h1>Tools</h1>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
	</p>
</div>

<div class="hero">
	<div class="subtitle">
		<h2>Mapping Tools</h2>
	</div>
</div>

<div class="card-grid">
	<ReportCard
		link={'/tools/mainstreet-demographic-map'}
		cardImage={mainstreets}
		title={'Main Street Demographic Map'}
		subtitle={''}
	/>

	<ReportCard
		link={'/'}
		cardImage={mainstreets}
		title={'Civic Infrastructure Provision Map'}
		subtitle={''}
	/>

	<ReportCard link={'/tools/housing-density-map'} cardImage={mainstreets} title={'Housing Density Map'} subtitle={''} />
</div>

<div class="hero">
	<div class="subtitle">
		<h2>Graphing Tools</h2>
	</div>
</div>

<div class="card-grid">
	<ReportCard
		link={'/tools/mainstreet-visitor-recovery'}
		cardImage={mainstreets}
		title={'Main Street Visitor Recovery'}
		subtitle={''}
	/>

	<!-- <ReportCard link={'/'} cardImage={mainstreets} title={'Main Street Correlation'} subtitle={''} /> -->
</div>

<div class="hero">
	<div class="subtitle">
		<h2>Qualitative Tools</h2>
	</div>
</div>

<div class="card-grid">
	<ReportCard
		link={'https://canurb.org/wp-content/uploads/Main-Street-Data-Readiness-Tool.pdf'}
		cardImage={opennorth}
		title={'Main Street Data and Technology Project Readiness'}
		subtitle={'Open North'}
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
