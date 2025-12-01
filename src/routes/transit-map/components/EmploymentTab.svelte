<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let employmentData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content">
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
				colors={['#db3069', '#0098D6', '#b0b0b0']}
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
