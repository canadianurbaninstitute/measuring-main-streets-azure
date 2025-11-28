<script lang="ts">
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	export let selectedStation;
	export let stationBuiltForm;
	export let selectedVariable: string;
	export let greenspaceVisible: boolean;
	export let waterVisible: boolean;
	export let buildingVisible: boolean;
	export let parkingVisible: boolean;
	export let toggleLayer: (layerId: string | string[], currentState: boolean) => boolean;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Population Density'}
			active={selectedVariable === 'PopulationDensity'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'PopulationDensity' ? 'PopulationDensity' : null)}
			value={Math.round(selectedStation.PopulationDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:people'}
		/>
		<TransitMetric
			active={selectedVariable === 'EmploymentDensity'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'EmploymentDensity' ? 'EmploymentDensity' : null)}
			label={'Employment Density'}
			value={Math.round(selectedStation.EmploymentDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:briefcase'}
		/>
	</div>
	<div class="grid grid-cols-2 gap-[0.3em]">
		<DonutMetric
			active={waterVisible}
			on:click={() =>
				(waterVisible = toggleLayer(['waterway-built-form', 'water-built-form'], waterVisible))}
			label={'Water'}
			value={Math.round(stationBuiltForm['water_pct'])}
			icon={'mdi:people'}
			suffix="%"
			fillColor={'#002940'}
			toggle={true}
		/>
		<DonutMetric
			active={greenspaceVisible}
			on:click={() => (greenspaceVisible = toggleLayer('greenspace', greenspaceVisible))}
			label={'Greenspace'}
			value={Math.round(stationBuiltForm['greenspace_pct'])}
			icon={'mdi:pine-tree-variant'}
			suffix="%"
			fillColor={'#43b171'}
			toggle={true}
		/>
		<DonutMetric
			active={buildingVisible}
			on:click={() => (buildingVisible = toggleLayer('all-buildings', buildingVisible))}
			label={'Buildings'}
			value={Math.round(stationBuiltForm['building_pct'])}
			icon={'mdi:office-building'}
			suffix="%"
			fillColor={'#555555'}
			toggle={true}
		/>
		<DonutMetric
			active={parkingVisible}
			on:click={() => (parkingVisible = toggleLayer('parking-built-form', parkingVisible))}
			label={'Parking'}
			value={Math.round(stationBuiltForm['parking_pct'])}
			icon={'mdi:car'}
			suffix="%"
			fillColor={'#999999'}
			toggle={true}
		/>
	</div>
</div>
