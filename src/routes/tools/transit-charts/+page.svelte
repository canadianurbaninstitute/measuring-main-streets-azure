<script lang="ts">
	// TODO: Number of employees McCowan/Sheppard seems high
	import { onMount } from 'svelte';
	// import stationData from '../../lib/data/transitdata/chart-stations.json';
	// import transitLines from '../../lib/data/transitdata/transit-lines-dropdown.json';
	import lineColors from '../../lib/data/transitdata/line-colors.json';
	import Select from '../../lib/ui/Select.svelte';
	import '../../styles.css';
	import TransitChart from './TransitChart.svelte';
	import TransitLegend from './TransitLegend.svelte';
	import TransitMap from './TransitMap.svelte';

	// Available metrics that can be displayed for each station add more as needed
	const variablesArray = {
		Demographics: [
			{ value: 'TotalPopulation', label: 'Population' },
			{ value: 'PopGrowth2020to2025', label: 'Population Growth 2020 to 2025' },
			{ value: 'PopGrowth2025to2030', label: 'Projected Population Growth 2025 to 2030' },
			{ value: 'TotalHouseholds', label: 'Households' },
			{
				value: 'AverageEmploymentIncome',
				label: 'Average Employment Income ($) (2021)'
			},
			{ value: 'TotalImmigrant', label: 'Total Immigrants (%)' },
			{ value: 'VisibleMinorityTotal', label: 'Visible Minorities (%)' },
			{ value: 'UniversityDegree', label: 'Population with University Degree (%)' },
			{ value: 'WorkingAge', label: 'Population that is Working Age (%)' },
			{ value: 'Youth', label: 'Population that are Youth (%)' }
		],
		Housing: [
			{ value: 'HousingTotal', label: 'Total Dwellings' },
			{ value: 'HouseValue', label: 'Average House Value ($) (2021)' },
			{ value: 'MonthlyRent', label: 'Average Monthly Rent ($) (2021)' },
			{
				value: 'MoreThan30OnShelter',
				label: 'Population spending ≥30% of income on shelter (%) (2021)'
			}
		],
		Employment: [
			{ value: 'EmployeeCount', label: 'Number of Employees' },
			{
				value: 'EmploymentDensity',
				label: 'Employment Density (per sq. km)'
			}
		],
		'Built Form': [{ value: 'PopulationDensity', label: 'Population Density (per sq. km)' }],
		'Complete Communities': [
			{ value: 'Main Street Business', label: 'Main Street Businesses' },
			{ value: 'bii', label: 'Independent Business Index (out of 1)' },
			{ value: 'Civic Infrastructure', label: 'Civic Infrastructure Locations' },
			{ value: 'Daily_Visits', label: 'Average Daily Visitors' },
			{ value: 'Unique_Visitors', label: 'Average Unique Daily Visitors' },
			{ value: 'Tier_1_presence', label: 'Tier 1 Complete Community Score' },
			{ value: 'Tier_2_presence', label: 'Tier 2 Complete Community Score' },
			{ value: 'Overall_score', label: 'Overall Complete Community Score' }
		]
	};

	let variables = $state(variablesArray);
	let flatVariables = $derived(Object.values(variables).flat());

	let selectedVariable = $state('TotalPopulation'); // Currently selected metric to display
	let dataSources = $state({
		data: [],
		visitorData: [],
		completeCommunityData: [],
		builtForm: []
	});
	let transitLines = $state();
	let selectedLine = $state(0);
	let selectedStation = $state(0);

	// Auto-select first available line when component initializes
	$effect(() => {
		if (selectedLine === 0 && transitLines) {
			console.log(transitLines);
			const firstRegion = Object.values(transitLines)[0];
			if (firstRegion?.length) {
				selectedLine = firstRegion[0].value;
			}
		}
	});

	let lineColor = $derived(lineColors[selectedLine]);
	let mergedData = $derived.by(() => {
		const { data, visitorData, completeCommunityData, builtForm } = dataSources;

		// If either dataset is empty, return empty array
		if (!data.length || !visitorData.length) return [];

		// Create a map of visitor data by station name for quick lookup
		const visitorMap = new Map(visitorData.map((station) => [station.id, station]));
		const ccMap = new Map(completeCommunityData.map((station) => [station.id, station]));
		const builtFormMap = new Map(builtForm.map((station) => [station.id, station]));

		// Merge the datasets
		return data.map((station) => {
			const visitorInfo = visitorMap.get(station.id);
			const ccInfo = ccMap.get(station.id);
			const builtFormInfo = builtFormMap.get(station.id);
			const result = {
				...station,
				water_pct: builtFormInfo?.water_pct || 0,
				greenspace_pct: builtFormInfo?.greenspace_pct || 0,
				building_pct: builtFormInfo?.building_pct || 0,
				parking_pct: builtFormInfo?.parking_pct || 0,
				Daily_Visits: visitorInfo?.Daily_Visits || 0,
				Unique_Visitors: visitorInfo?.Unique_Visitors || 0,
				Tier_1_presence: ccInfo?.Tier_1_presence || 0,
				Tier_2_presence: ccInfo?.Tier_2_presence || 0,
				Overall_score: ccInfo?.Overall_score || 0
			};
			return result;
		});
	});

	let currentData = $derived(
		mergedData.filter((station) => station.line_id === selectedLine.toString())
	);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/chart_stations_enriched.json'
			);
			dataSources.data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			);
			dataSources.builtForm = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-lines-dropdown.json'
			);
			transitLines = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/visitor_data.json'
			);
			dataSources.visitorData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_presence.json'
			);
			dataSources.completeCommunityData = await response.json();
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
		patterns in the station areas of the transit system. Data is from 2024 unless otherwise
		specified. Inspired by <a
			href="https://schoolofcities.github.io/tod-toronto-1996-to-2021/"
			target="_blank"><u>School of Cities</u></a
		>.
	</p>
	<p class="text-sm mt-4">
		<em>This tool is in beta.</em>
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
	<div class="col-span-1 md:col-span-1 w-[90%] md:w-full order-2 md:order-1">
		<TransitMap bind:selectedLine bind:selectedStation {currentData} {selectedVariable} />
	</div>
	<div class="col-span-1 md:col-span-2 w-[90%] order-1 md:order-2">
		{#if currentData}
			<TransitChart
				data={currentData}
				bind:selectedLine
				variables={flatVariables}
				bind:selectedStation
				{selectedVariable}
			/>
			{#if typeof lineColor === 'string'}
				<TransitLegend bind:lineColor />
			{/if}
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
