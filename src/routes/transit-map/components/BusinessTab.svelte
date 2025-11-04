<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import GaugeMetric from '../../lib/components/GaugeMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let businessData;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Main Street Businesses'}
			value={Math.round(selectedStation.BusinessCount).toLocaleString()}
			icon={'mdi:shop'}
		/>
		<GaugeMetric label={'Independent Business Index'} value={selectedStation.bii} maxValue={1} />
	</div>
	<div class="chart-container">
		<div class="chart">
			<BarChart
				colors={['#43b171', '#F13737', '#2a5cac']}
				data={businessData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Main Street Business"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
