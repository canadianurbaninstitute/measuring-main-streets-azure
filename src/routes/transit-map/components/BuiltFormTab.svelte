<script lang="ts">
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import DonutMetric from '../../lib/components/DonutMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let stationBuiltForm;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Population Density'}
			value={Math.round(selectedStation.PopulationDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:people'}
		/>
		<TransitMetric
			label={'Employment Density'}
			value={Math.round(selectedStation.EmploymentDensity).toLocaleString() + ' / sq. km'}
			icon={'mdi:briefcase'}
		/>
	</div>
	<div class="grid grid-cols-2 gap-[0.3em]">
		<DonutMetric
			label={'Water'}
			value={Math.round(stationBuiltForm['water_pct'] * 10) / 10}
			icon={'mdi:people'}
			suffix="%"
			fillColor={'#002940'}
		/>
		<DonutMetric
			label={'Greenspace'}
			value={Math.round(stationBuiltForm['greenspace_pct'] * 10) / 10}
			icon={'mdi:pine-tree-variant'}
			suffix="%"
			fillColor={'#43b171'}
		/>
		<DonutMetric
			label={'Buildings'}
			value={Math.round(stationBuiltForm['building_pct'] * 10) / 10}
			icon={'mdi:office-building'}
			suffix="%"
			fillColor={'#555555'}
		/>
		<DonutMetric
			label={'Parking'}
			value={Math.round(stationBuiltForm['parking_pct'] * 10) / 10}
			icon={'mdi:car'}
			suffix="%"
			fillColor={'#999999'}
		/>
	</div>
</div>
