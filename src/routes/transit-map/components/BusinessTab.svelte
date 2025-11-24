<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import GaugeMetric from '../../lib/components/GaugeMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let businessData;
	export let civicData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Main Street Businesses'}
			active={selectedVariable === 'BusinessCount'}
			on:click={() => onSelectVariable('BusinessCount')}
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
	<TransitMetric
		label={'Civic Infrastructure Locations'}
		active={selectedVariable === 'CivicCount'}
		on:click={() => onSelectVariable('CivicCount')}
		value={Math.round(selectedStation.CivicCount).toLocaleString()}
		icon={'mdi:museum'}
	/>
	<div class="chart-container">
		<div class="chart">
			<BarChart
				colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
				data={civicData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Civic Infrastructure"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
