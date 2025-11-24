<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let stationBuiltForm;
	export let builtFormData;
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
	<div class="chart">
		<BarChart
			colors={['#2a5cac']}
			data={builtFormData}
			xKey="value"
			yKey="label"
			title="Built Form Composition"
			yMax="100"
			xSuffix="%"
			padding={{ top: 0, bottom: 20, left: 60, right: 0 }}
		/>
	</div>
</div>
