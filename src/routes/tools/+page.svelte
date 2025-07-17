<script>
	import '../styles.css';
	import ReportCard from '../lib/ui/ReportCard.svelte';
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import civic from '../lib/assets/graphics/civic.svg';
	import housing from '../lib/assets/graphics/housing.svg';
	import demographic from '../lib/assets/graphics/demographic.svg';
	import regional from '../lib/assets/graphics/regional.svg';
	import opennorth from '../lib/assets/graphics/opennorth.svg';
	import Footer from '../lib/ui/Footer.svelte';
</script>

<div class="hero">
	<h1>Tools</h1>
	<p>
		The following set of tools emerged out of the national mapping tool construction, offering a package of resources aimed at supporting deeper understanding and analysis of critical components of main street health. These tools can be used by anyone to dive into their main street context, however the qualitative tool by Open North is specifically designed for practitioners making infrastructure decisions. More tools are coming soon!
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
		cardImage={demographic}
		title={'Main Street Demographic Map'}
		subtitle={''}
	/>

	<ReportCard
		link={'/tools/civic-infrastructure-provision-map'}
		cardImage={civic}
		title={'Civic Infrastructure Provision Map'}
		subtitle={''}
	/>

	<ReportCard link={'/tools/housing-density-map'} cardImage={housing} title={'Housing Dot Density Map'} subtitle={''} />

	<!-- <ReportCard link={'/tools'} cardImage={regional} title={'Regional Main Street Metrics Map'} subtitle={''} /> -->

</div>

<div class="hero">
	<div class="subtitle">
		<h2>Graphing Tools</h2>
	</div>
	<p>This tool is only applicable for main streets included in a case study.</p>

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

	@media only screen and (min-width: 992px) {
		.card-grid {
			grid-template-columns: repeat(1, 1fr);
		}
	}
	

	h1 {
		margin-bottom: 0;
	}


	@media only screen and (min-width: 768px) {

.hero {
	margin: 2em 15em 2em 15em;
}

.card-grid {
	margin: 2em 15em 2em 15em;
}


}

</style>
