<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import {
		HouseValue,
		HousingTotal,
		MonthlyRent,
		MoreThan30OnShelter
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/charts/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/charts/TransitMetric.svelte';
	import './tabs.css';

	let {
		selectedStation,
		ownerData,
		dwellingData,
		housingData,
		bedData,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();
</script>

<div class="tab-content gap-1">
	<div class="metric-container">
		{#each [HousingTotal, HouseValue, MonthlyRent] as metric}
			<TransitMetric
				label={metric.label}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={metric.unit === '$'
					? metric.unit + Math.round(selectedStation[metric.key]).toLocaleString()
					: Math.round(selectedStation[metric.key]).toLocaleString()}
				icon={metric.icon}
				disabled={metric.key === 'HousingTotal'}
			/>
		{/each}
	</div>
	<DonutMetric
		label={MoreThan30OnShelter.label}
		value={Math.round(selectedStation[MoreThan30OnShelter.key])}
		icon={MoreThan30OnShelter.icon}
		suffix={MoreThan30OnShelter.unit}
		fillColor={'#002940'}
		disabled
	/>
	<div class="tab-chart-container">
		<div class="tab-chart">
			<BarChart
				colors={['#002a41', '#0098D6']}
				data={ownerData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Owners/Renters"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#002a41', '#0098D6', '#F35D00', '#db3069', '#8A4285', '#43B171']}
				data={dwellingData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Dwelling Type"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#002a41']}
				data={housingData}
				xKey="value"
				yKey="label"
				title="Housing Construction Year"
				yMax="100"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#2a5cac']}
				data={bedData}
				xKey="value"
				yKey="label"
				title="Number of Bedrooms"
				yMax="100"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
			/>
		</div>
	</div>
</div>
