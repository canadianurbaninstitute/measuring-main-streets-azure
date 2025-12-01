<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import Icon from '@iconify/svelte';
	import EmpSizeLegend from '../../lib/assets/employmentsizelegend.svg';
	import './tabs.css';

	export let map;
	export let selectedStation;
	export let employmentData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content">
	<div class="legend-container">
		<Accordion>
			<div class="inline-header" slot="header">
				<div class="text-sm inline-header">
					<Icon icon="mdi:map-legend" />Legend<Icon icon="iconoir:nav-arrow-down" />
				</div>
			</div>
			<div slot="body">
				<h6 class="mt-3">Employer Type</h6>
				<p class=" mb-3 italic">by Complete Community Tier</p>
				<div class="text-sm italic">Click on a layer to turn it on or off</div>
				<LegendItem
					{map}
					variant={'circle'}
					label={'Tier 1'}
					bgcolor={'#db3069'}
					bordercolor={'#fff'}
					button={true}
					id={'employment-size'}
					useFilter={true}
					filterProperty="Tier"
					filterValue={1}
				/>
				<LegendItem
					{map}
					variant={'circle'}
					label={'Tier 2'}
					bgcolor={'#2a5cac'}
					bordercolor={'#fff'}
					button={true}
					id={'employment-size'}
					useFilter={true}
					filterProperty="Tier"
					filterValue={2}
				/>
				<div class="text-sm italic mt-3">Number of Employees</div>
				<div class="mx-6">
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
			</div>
		</Accordion>
	</div>
	<TransitMetric
		label={'Total Employment'}
		active={selectedVariable === 'EmployeeCount'}
		on:click={() => onSelectVariable(selectedVariable !== 'EmployeeCount' ? 'EmployeeCount' : null)}
		value={Math.round(selectedStation.EmployeeCount).toLocaleString()}
		icon={'mdi:briefcase'}
	/>
	<div class="chart-container">
		<div class="chart">
			<BarChart
				colors={['#db3069', '#2a5cac', '#ddd']}
				data={employmentData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Employment Mix"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
