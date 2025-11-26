<script lang="ts">
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	export let selectedStation;
	export let stationBuiltForm;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Population Density'}
			active={selectedVariable === 'PopulationDensity'}
			on:click={() => onSelectVariable('PopulationDensity')}
			value={Math.round(selectedStation.PopulationDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:people'}
		/>
		<TransitMetric
			active={selectedVariable === 'EmploymentDensity'}
			on:click={() => onSelectVariable('EmploymentDensity')}
			label={'Employment Density'}
			value={Math.round(selectedStation.EmploymentDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:briefcase'}
		/>
	</div>
	<div class="grid grid-cols-2 gap-[0.3em]">
		<DonutMetric
			label={'Water'}
			disabled
			value={Math.round(stationBuiltForm['water_pct'] * 10) / 10}
			icon={'mdi:people'}
			suffix="%"
			fillColor={'#002940'}
		/>
		<DonutMetric
			label={'Greenspace'}
			disabled
			value={Math.round(stationBuiltForm['greenspace_pct'] * 10) / 10}
			icon={'mdi:pine-tree-variant'}
			suffix="%"
			fillColor={'#43b171'}
		/>
		<DonutMetric
			label={'Buildings'}
			disabled
			value={Math.round(stationBuiltForm['building_pct'] * 10) / 10}
			icon={'mdi:office-building'}
			suffix="%"
			fillColor={'#555555'}
		/>
		<DonutMetric
			label={'Parking'}
			disabled
			value={Math.round(stationBuiltForm['parking_pct'] * 10) / 10}
			icon={'mdi:car'}
			suffix="%"
			fillColor={'#999999'}
		/>
	</div>
</div>
