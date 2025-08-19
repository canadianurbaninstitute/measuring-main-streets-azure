<script>
	import stationData from '../../lib/data/transitdata/chart-stations.json';
	import transitLines from '../../lib/data/transitdata/transit-lines-dropdown.json';
	import '../../styles.css';
	import TransitChart from './TransitChart.svelte';
	import TransitMap from './TransitMap.svelte';

	// Available metrics that can be displayed for each station add more as needed
	const variablesArray = [
		{ value: 'TotalPopulation', label: 'Population' },
		{ value: 'TotalHouseholds', label: 'Households' },
		{ value: 'GreenspaceArea', label: 'Greenspace (square metres)' },
		{ value: 'AverageEmploymentIncome', label: 'Average Employment Income ($) (2021)' },
		{ value: 'HouseValue', label: 'Average House Value ($) (2021)' },
		{ value: 'MonthlyRent', label: 'Average Monthly Rent ($) (2021)' }
	];

	let variables = $state(variablesArray);
	let data = $state(stationData);
	let selectedLine = $state(0);
	// Auto-select first available line when component initializes
	$effect(() => {
		if (selectedLine === 0 && transitLines) {
			const firstRegion = Object.values(transitLines)[0];
			if (firstRegion?.length) {
				selectedLine = firstRegion[0].value;
			}
		}
	});
</script>

<div class="hero">
	<h1>Transit Charts {selectedLine}</h1>
	<p>
		The transit chart shows key data for each stop along a selected transit line. You can choose a
		line and a metric—such as population, households, or average income—and the chart will update to
		display how that metric varies across the stations. Each bar represents a stop, with taller bars
		indicating higher values. This helps you quickly compare areas along the route and understand
		patterns in the station areas of the transit system.
	</p>
</div>
<div class="grid grid-cols-3 gap-4">
	<div class="chart-container col-span-3">
		<TransitMap bind:selectedLine />
	</div>
	<div class="chart-container col-span-3">
		<TransitChart {data} bind:selectedLine {variables} />
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.chart-container {
		margin: 2em;
	}
</style>
