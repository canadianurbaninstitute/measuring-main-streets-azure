<script lang="ts">
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
	<div class="metric-container">
		<TransitMetric
			disabled
			label={'Green Space'}
			value={Math.round(stationBuiltForm.greenspace_area).toLocaleString() + ' sq. m'}
			icon={'mdi:pine-tree-variant'}
		/>
		<TransitMetric
			disabled
			label={'Water'}
			value={Math.round(stationBuiltForm.water_area).toLocaleString() + ' sq. m'}
			icon={'mdi:waves'}
		/>
		<TransitMetric
			disabled
			label={'Buildings'}
			value={Math.round(stationBuiltForm.building_area).toLocaleString() + ' sq. m'}
			icon={'mdi:office-building'}
		/>
		<TransitMetric
			disabled
			label={'Parking'}
			value={Math.round(stationBuiltForm.parking_area).toLocaleString() + ' sq. m'}
			icon={'mdi:car'}
		/>
	</div>
</div>
