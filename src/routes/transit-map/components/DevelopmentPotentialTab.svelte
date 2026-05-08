<script lang="ts">
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import RadarChart from '../../tools/development-potential/RadarChart.svelte';
	import ScoreBar from '../../tools/development-potential/ScoreBar.svelte';
	import './tabs.css';

	let { selectedStation, stationDpiData } = $props();

	console.log({ stationDpiData });

	const potentialMap: Record<string, number> = {
		'Very High': 10,
		High: 7.5,
		Moderate: 5,
		Low: 2.5,
		'Very Low': 0.25
	};

	const dpiData = $derived(
		stationDpiData?.find((d: any) => String(d.id) === String(selectedStation.id))
	);

	const landRadarPoints = $derived(
		dpiData
			? [
					{ label: 'Single Unit Dwellings', value: (dpiData.single_units || 0) * 100 },
					{ label: 'Total Developable Land', value: (dpiData.DevelopableArea || 0) * 100 },
					{ label: 'High Opportunity Sites', value: (dpiData.HighOpportunityArea || 0) * 100 },
					{ label: 'Employment Density', value: (dpiData.EmploymentDensity || 0) * 100 },
					{ label: 'Population Density', value: (dpiData.PopulationDensity || 0) * 100 }
				]
			: []
	);

	const growthRadarPoints = $derived(
		dpiData
			? [
					{ label: 'Pop Change 2020-25', value: (dpiData.PopChange2020to2025 || 0) * 100 },
					{ label: 'Pop Change 2025-30', value: (dpiData.PopChange2025to2030 || 0) * 100 },
					{
						label: 'Municipal Pop Change 20-25',
						value: (dpiData.MunicipalPopChange2020to2025 || 0) * 100
					},
					{ label: 'Complete Community Score', value: (dpiData.OverallCCScore || 0) * 100 },
					{ label: 'Daily Visits', value: (dpiData.DailyVisits || 0) * 100 }
				]
			: []
	);

	const displacementRadarPoints = $derived(
		dpiData
			? [
					{
						label: '>30% of income spent on shelter',
						value: (dpiData.MoreThan30OnShelter || 0) * 100
					},
					{ label: 'Total Immigrants', value: (dpiData.TotalImmigrant || 0) * 100 },
					{
						label: 'Total Visible Minorities',
						value: (dpiData.VisibleMinorityTotal || 0) * 100
					},
					{ label: 'Pop Under 19 or Over 65', value: (dpiData.YouthElderly || 0) * 100 },
					{ label: 'Low Income Population', value: (dpiData.LowIncome || 0) * 100 }
				]
			: []
	);

	const metrics = $derived([
		{ label: 'Land Availability', key: 'LALevel', icon: 'mdi:land-plots' },
		{ label: 'Growth Pressure', key: 'GPLevel', icon: 'mdi:trending-up' },
		{ label: 'Displacement Risk', key: 'DRLevel', icon: 'mdi:alert-circle' }
	]);
</script>

<div class="tab-content gap-1">
	<div class="metric-container">
		{#each metrics as metric}
			<TransitMetric
				label={metric.label}
				value={dpiData ? dpiData[metric.key] : 'N/A'}
				icon={metric.icon}
			/>
		{/each}
	</div>

	<div class="tab-chart-container">
		<div class="tab-chart flex flex-col items-center">
			<h6 class="chart-title">Overall Development Potential</h6>
			{#if dpiData}
				<div class="text-3xl font-bold text-blue-600 mb-2">{dpiData.potential}</div>
				<ScoreBar
					score={potentialMap[dpiData.potential]}
					maxScore={10}
					colors={['#00adf2', '#db3069']}
				/>
			{:else}
				<div class="py-10 text-gray-400 italic">No data available for this station</div>
			{/if}
		</div>
	</div>
	<!-- <h6 class="chart-title">Land Availability</h6>
	<div class="w-full aspect-square p-12">
		<RadarChart data={landRadarPoints} color="#00adf2" max={100} />
	</div>
	<div class="w-full aspect-square p-12">
		<h6 class="chart-title">Growth Pressure</h6>
		<RadarChart data={growthRadarPoints} color="#db3069" max={100} />
	</div>
	<div class="w-full aspect-square p-12">
		<h6 class="chart-title">Displacement Risk</h6>
		<RadarChart data={displacementRadarPoints} color="#f45d01" max={100} />
	</div> -->
</div>
