<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import Icon from '@iconify/svelte';
	import './tabs.css';

	export let map;
	export let selectedStation;
	export let ownerData;
	export let dwellingData;
	export let housingData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
	export let bedData;
</script>

<div class="tab-content gap-1">
	<div class="legend-container">
		<Accordion>
			<div class="inline-header" slot="header">
				<div class="text-sm inline-header">
					<Icon icon="mdi:map-legend" />Legend<Icon icon="iconoir:nav-arrow-down" />
				</div>
			</div>
			<div slot="body">
				<h6 class="my-3">Housing Type</h6>
				<div class="text-sm italic">Click on a layer to turn it on or off</div>
				<LegendItem
					{map}
					variant={'circle'}
					label={'Residential'}
					bgcolor={'#db3069'}
					bordercolor={'#fff'}
					button={true}
					id={'all-nar'}
					useFilter={true}
					filterProperty="bu_use"
					filterValue={'Residential'}
				/>
				<LegendItem
					{map}
					variant={'circle'}
					label={'Mixed Use'}
					bgcolor={'#00adf2'}
					bordercolor={'#fff'}
					button={true}
					id={'all-nar'}
					useFilter={true}
					filterProperty="bu_use"
					filterValue={'Partial Residential'}
				/>
				<div class="text-sm italic">Size = Number of Units</div>
			</div>
		</Accordion>
	</div>
	<div class="grid grid-cols-3 gap-[0.3em]">
		<TransitMetric
			disabled
			label={'Total Dwellings'}
			active={selectedVariable === 'HousingTotal'}
			on:click={() => onSelectVariable(selectedVariable !== 'HousingTotal' ? 'HousingTotal' : null)}
			value={selectedStation.HousingTotal.toLocaleString()}
			icon={'mdi:house'}
		/>
		<TransitMetric
			label={'Average Value'}
			active={selectedVariable === 'HouseValue'}
			on:click={() => onSelectVariable(selectedVariable !== 'HouseValue' ? 'HouseValue' : null)}
			value={Math.round(selectedStation.HouseValue).toLocaleString()}
			icon={'mdi:dollar'}
		/>
		<TransitMetric
			label={'Average Rent'}
			active={selectedVariable === 'MonthlyRent'}
			on:click={() => onSelectVariable(selectedVariable !== 'MonthlyRent' ? 'MonthlyRent' : null)}
			value={Math.round(selectedStation.MonthlyRent).toLocaleString()}
			icon={'mdi:dollar'}
		/>
	</div>
	<DonutMetric
		label={'Spending ≥30% of income shelter'}
		value={Math.round(selectedStation['MoreThan30OnShelter'])}
		icon={'mdi:home'}
		suffix="%"
		fillColor={'#002940'}
		disabled
	/>
	<div class="tab-chart-container">
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
