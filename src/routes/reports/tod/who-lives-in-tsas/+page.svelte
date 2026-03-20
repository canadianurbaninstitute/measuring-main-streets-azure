<script>
	// Images
	import Vancouver from './assets/Vancouver.png';
	import Calgary from './assets/Calgary.png';
	import Edmonton from './assets/Edmonton.png';
	import KWC from './assets/KWC.png';
	import Montreal from './assets/Montreal.png';
	import Ottawa from './assets/Ottawa-Gatineau.png';
	import Toronto from './assets/Toronto.png';
	import Canada from './assets/Canada.png';

	// Data
	import data from './data/TSA_all_demos.csv';

	// Components
	import HeroCard from '../../../lib/ui/HeroCard.svelte';
	import { BarChart } from '@onsvisual/svelte-charts';
	import StatChart from './components/StatChart.svelte';
	import '../../../styles.css';

	let selectedRegion = 'Calgary';

	const images = {
		Canada,
		Vancouver: Vancouver,
		Calgary: Calgary,
		Edmonton: Edmonton,
		'Kitchener - Cambridge - Waterloo': KWC,
		Montreal: Montreal,
		'Ottawa - Gatineau': Ottawa,
		Toronto: Toronto,
		Canada: Canada
	};
	const regions = [
		{ value: 'Canada', name: 'Canada' },
		{ value: 'Calgary', name: 'Calgary' },
		{ value: 'Edmonton', name: 'Edmonton' },
		{ value: 'Kitchener - Cambridge - Waterloo', name: 'Kitchener - Cambridge - Waterloo' },
		{ value: 'Montreal', name: 'Montreal' },
		{ value: 'Ottawa - Gatineau', name: 'Ottawa - Gatineau' },
		{ value: 'Toronto', name: 'Toronto' },
		{ value: 'Vancouver', name: 'Vancouver' }
	];

	$: currentImage = images[selectedRegion] ?? null;

	$: selectedRow = data.find((d) => d.Region === selectedRegion) ?? data[0];

	$: activeData = [
		{ label: selectedRow.TSAChartLabel, value: selectedRow.Active_In },
		{ label: selectedRow.CMAChartLabel, value: selectedRow.Active_Out }
	];

	$: transitData = [
		{ label: selectedRow.TSAChartLabel, value: selectedRow.Public_Transit_In },
		{ label: selectedRow.CMAChartLabel, value: selectedRow.Public_Transit_Out }
	];

	$: transportCostData = [
		{ label: selectedRow.TSAChartLabel, value: selectedRow.Transport_Cost_In },
		{ label: selectedRow.CMAChartLabel, value: selectedRow.Transport_Cost_Out }
	];
</script>

<main class="p-10 md:p-50">
	<h1 class="infographic-title p-10" style="text-align: center;">
		Who Lives in {selectedRow.Region}'s Transit Station Areas?
	</h1>

	<div class="region-description grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
		<div class="image-container">
			{#if currentImage}
				<img src={currentImage} alt={selectedRegion} class="region-image" />
			{/if}
		</div>
		<div>
			<div class="region-selector pb-8">
				<label for="region-select" class="selector-label">Select a region:</label>
				<select id="region-select" bind:value={selectedRegion} class="selector">
					{#each regions as region}
						<option value={region.value}>{region.name}</option>
					{/each}
				</select>
			</div>
			<p>
				<b style="color: var(--brandDarkBlue);">Transit Station Areas (TSAs)</b> refer to the area
				within an 800m radius of a transit station.<br /><br />

				The following data compares the population within TSAs to the population outside of TSAs in
				<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME}</b>.
			</p>
		</div>
	</div>

	<div class="infographic-section">
		<div class="section-title pb-8 text-center">On the Move</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#key selectedRegion}
				<div class="single-chart">
					<h4 class="chart-title p-2">Active Transportation</h4>
					<BarChart
						colors={['#db3069']}
						data={activeData}
						xKey="value"
						yKey="label"
						yMax="100"
						xSuffix="%"
						padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
					/>
					<div class="p-2">
						<p class="stat-header">{selectedRow.TSANAME}</p>
						<span class="stat">{Math.round(activeData[0].value)}%</span> of population use active transportation
					</div>
					<div class="p-2">
						<p class="stat-header">{selectedRow.CMANAME}</p>
						<span class="stat">{Math.round(activeData[1].value)}%</span> of population use active transportation
					</div>
				</div>

				<div class="single-chart">
					<h4 class="chart-title p-2">Public Transit</h4>
					<BarChart
						colors={['#db3069']}
						data={transitData}
						xKey="value"
						yKey="label"
						yMax="100"
						xSuffix="%"
						padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
					/>
					<div class="p-2">
						<p class="stat-header">{selectedRow.TSANAME}</p>
						<span class="stat">{Math.round(transitData[0].value)}%</span> of population use public transit
					</div>
					<div class="p-2">
						<p class="stat-header">{selectedRow.CMANAME}</p>
						<span class="stat">{Math.round(transitData[1].value)}%</span> of population use public transit
					</div>
				</div>

				<div class="single-chart">
					<h4 class="chart-title p-2">Average Transportation Cost</h4>
					<BarChart
						colors={['#db3069']}
						data={transportCostData}
						xKey="value"
						yKey="label"
						padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
					/>
					<div class="p-2">
						<p class="stat-header">{selectedRow.TSANAME}</p>
						<span class="stat">${Math.round(transportCostData[0].value).toLocaleString()}</span> spent
						on transportation on average
					</div>
					<div class="p-2">
						<p class="stat-header">{selectedRow.CMANAME}</p>
						<span class="stat">${Math.round(transportCostData[1].value).toLocaleString()}</span> spent
						on transportation on average
					</div>
				</div>
			{/key}
		</div>
	</div>
</main>

<style>
	.infographic-title {
		font-size: 60px;
	}
	.section-title {
		font-size: 40px;
		font-weight: 600;
		color: var(--brandDarkBlue);
		/* text-transform: uppercase; */
	}
	.chart-title {
		font-size: 20px;
		font-weight: 400;
		color: var(--brandDarkBlue);
	}
	.stat {
		font-size: 24px;
		font-weight: 600;
		color: var(--brandPink);
	}
	.stat-header {
		font-size: 16px;
		font-weight: 600;
		color: var(--brandDarkBlue);
	}
	.region-selector {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}
	.selector-label {
		font-size: 16px;
		font-weight: 600;
		color: var(--brandDarkBlue);
	}
	.selector {
		font-size: 16px;
		padding: 8px 12px;
		border: 2px solid var(--brandDarkBlue);
		border-radius: 6px;
		color: var(--brandDarkBlue);
		background: white;
		cursor: pointer;
		min-width: 280px;
	}
	.selector:focus {
		outline: none;
		border-color: var(--brandPink);
	}
	.region-image {
		width: 100%;
		max-width: 400px;
		height: auto;
		margin-bottom: 20px;
		border-radius: 8px;
	}
</style>
