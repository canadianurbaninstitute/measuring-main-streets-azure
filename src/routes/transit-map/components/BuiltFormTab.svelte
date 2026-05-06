<script lang="ts">
	import {
		building_pct,
		EmploymentDensity,
		greenspace_pct,
		parking_pct,
		PopulationDensity,
		water_pct
	} from '../../lib/data/transitdata/config.json';
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import DonutMetric from '../../lib/ui/charts/DonutMetric.svelte';
	import GaugeMetric from '../../lib/ui/charts/GaugeMetric.svelte';
	import TransitMetric from '../../lib/ui/charts/TransitMetric.svelte';
	import './tabs.css';
	let {
		selectedStation,
		stationBuiltForm,
		stationDpiData,
		greenspaceVisible = $bindable(),
		waterVisible = $bindable(),
		buildingVisible = $bindable(),
		parkingVisible = $bindable(),
		selectedVariable = $bindable(),
		toggleLayer,
		onSelectVariable
	} = $props();

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

	const dpiMetrics = [
		{ label: 'Land Availability', key: 'LALevel', icon: 'mdi:land-plots' },
		{ label: 'Growth Pressure', key: 'GPLevel', icon: 'mdi:trending-up' },
		{ label: 'Displacement Risk', key: 'DRLevel', icon: 'mdi:alert-circle' }
	];
</script>

<div class="tab-content">
	<div class="metric-container">
		{#each [PopulationDensity, EmploymentDensity] as metric}
			{#if selectedStation[metric.key] !== undefined}
				<TransitMetric
					label={metric.label + (metric.unit ? ' (' + metric.unit + ')' : '')}
					active={selectedVariable === metric.key}
					on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
					value={Math.round(selectedStation[metric.key]).toLocaleString()}
					icon={metric.icon}
				/>
			{/if}
		{/each}
	</div>
	<div class="metric-container">
		{#each dpiMetrics as metric}
			<TransitMetric
				disabled
				label={metric.label}
				value={dpiData ? dpiData[metric.key] : 'N/A'}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="flex flex-row gap-[0.3em] w-full flex-wrap">
		<GaugeMetric
			title="Overall Development Potential"
			value={potentialMap[dpiData.potential]}
			maxValue={10}
			size={200}
			segmentColors={['#f13737', '#f1c500', '#58e965']}
			label={dpiData.potential}
			showValue={false}
		/>
	</div>
	<div class="grid grid-cols-2 gap-[0.3em]">
		<DonutMetric
			active={waterVisible}
			on:click={() =>
				(waterVisible = toggleLayer(['waterway-built-form', 'water-built-form'], waterVisible))}
			label={water_pct.label}
			value={Math.round(stationBuiltForm[water_pct.key])}
			icon={water_pct.icon}
			suffix={water_pct.unit}
			fillColor={'#002940'}
			toggle={true}
		/>
		<DonutMetric
			active={greenspaceVisible}
			on:click={() => (greenspaceVisible = toggleLayer('greenspace-built-form', greenspaceVisible))}
			label={greenspace_pct.label}
			value={Math.round(stationBuiltForm[greenspace_pct.key])}
			icon={greenspace_pct.icon}
			suffix={greenspace_pct.unit}
			fillColor={'#43b171'}
			toggle={true}
		/>
		<DonutMetric
			active={buildingVisible}
			on:click={() => (buildingVisible = toggleLayer('all-buildings', buildingVisible))}
			label={building_pct.label}
			value={Math.round(stationBuiltForm[building_pct.key])}
			icon={building_pct.icon}
			suffix={building_pct.unit}
			fillColor={'#555555'}
			toggle={true}
		/>
		<DonutMetric
			active={parkingVisible}
			on:click={() => (parkingVisible = toggleLayer('parking-built-form', parkingVisible))}
			label={parking_pct.label}
			value={Math.round(stationBuiltForm[parking_pct.key])}
			icon={parking_pct.icon}
			suffix={parking_pct.unit}
			fillColor={'#999999'}
			toggle={true}
		/>
	</div>

	<CustomButton
		href="/tools/built-form"
		label="Read the Development Potential Report"
		color="green"
		className="mt-2 w-full"
	/>
	<CustomButton
		href="/tools/built-form"
		label="Try the Development Potential Tool"
		color="green"
		variant="secondary"
		className="mt-2 w-full"
	/>
	<CustomButton
		href="/tools/built-form"
		label="Try the Built Form Tool"
		variant="secondary"
		className="mt-2 w-full"
	/>
</div>
