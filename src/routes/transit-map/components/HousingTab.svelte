<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let ownerData;
	export let dwellingData;
	export let housingData;
	export let bedData;
</script>

<div class="tab-content">
	<div class="metric-container">
		<TransitMetric
			label={'Total Dwellings'}
			value={selectedStation.HousingTotal.toLocaleString()}
			icon={'mdi:house'}
		/>
		<TransitMetric
			label={'Average Value'}
			value={Math.round(selectedStation.HouseValue).toLocaleString()}
			icon={'mdi:dollar'}
		/>
		<TransitMetric
			label={'Average Rent'}
			value={Math.round(selectedStation.MonthlyRent).toLocaleString()}
			icon={'mdi:dollar'}
		/>
	</div>
	<div class="chart-container">
		<div class="chart">
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
		<div class="chart">
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
		<div class="chart">
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
		<div class="chart">
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
