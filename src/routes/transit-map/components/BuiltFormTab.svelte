<script lang="ts">
	import {
		EmploymentDensity,
		PopulationDensity,
		water_pct,
		greenspace_pct,
		parking_pct,
		building_pct
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	let {
		selectedStation,
		stationBuiltForm,
		greenspaceVisible = $bindable(),
		waterVisible = $bindable(),
		buildingVisible = $bindable(),
		parkingVisible = $bindable(),
		selectedVariable = $bindable(),
		toggleLayer,
		onSelectVariable
	} = $props();
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
</div>
