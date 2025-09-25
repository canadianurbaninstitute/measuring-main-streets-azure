<script>
	import { onMount } from 'svelte';
  // import stationData from '../../lib/data/transitdata/chart-stations.json';
	import transitLines from '../../lib/data/transitdata/transit-lines-dropdown.json';
	import Select from '../../lib/ui/Select.svelte';
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
	let selectedVariable = $state('TotalPopulation'); // Currently selected metric to display
	let data = $state();
	let selectedLine = $state(0);
	let selectedStation = $state(0);
	// Auto-select first available line when component initializes
	$effect(() => {
		if (selectedLine === 0 && transitLines) {
			const firstRegion = Object.values(transitLines)[0];
			if (firstRegion?.length) {
				selectedLine = firstRegion[0].value;
			}
		}
	});

  onMount(async () => {
    try {
      const response = await fetch('https://measuringmainstreets.blob.core.windows.net/public/transit-data/chart-stations.json');
      data = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

</script>

<div class="hero">
	<h1>Transit Charts</h1>
	<p>
		The transit chart shows key data for each stop along a selected transit line. You can choose a
		line and a metric—such as population, households, or average income—and the chart will update to
		display how that metric varies across the stations. Each bar represents a stop, with taller bars
		indicating higher values. This helps you quickly compare areas along the route and understand
		patterns in the station areas of the transit system.
	</p>
</div>
<div class="chart-container grid grid-cols-1 md:grid-cols-3 gap-4">
	<!-- Control panel for user selections -->
	<div class="container col-span-1 md:col-span-3">
		<div class="controls">
			<div class="select-wrapper">
				<label for="line-select">Select Line:</label>
				<Select
					data={transitLines}
					icon="mdi:train"
					placeholder={'Select a Transit Line'}
					bind:selected={selectedLine}
				></Select>
			</div>
			<div class="select-wrapper">
				<label for="variable-select">Select Variable:</label>
				<Select
					data={variables}
					icon="mdi:chart-bar"
					placeholder={'Select Variable'}
					bind:selected={selectedVariable}
				></Select>
			</div>
		</div>
		<!-- <div class="select-wrapper">
			<Combobo
			data={transitStations}
			icon="mdi:train"
			placeholder={'Search for a Transit Station'}
		></Combobox>
		</div> -->
	</div>
	<div class="col-span-1 md:col-span-1 w-[90%] md:w-full">
		<TransitMap bind:selectedLine bind:selectedStation />
	</div>
	<div class="col-span-1 md:col-span-2">
    {#if data?.length}
		<TransitChart {data} bind:selectedLine {variables} bind:selectedStation {selectedVariable} />
    {/if}
	</div>
</div>

<style lang="postcss">
	/* Main container styling */
	.container {
		width: 100%;
	}
	/* Control panel layout */
	.controls {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		min-width: 350px;
	}
	.select-wrapper label {
		font-size: 0.9em;
		font-weight: 500;
		color: #333;
	}

	@reference "tailwindcss";
	.chart-container {
		margin: 2em;
	}
</style>
