<script lang="ts">
	// @ts-ignore-next-line
	import { BarChart } from '@onsvisual/svelte-charts';
	import { EmployeeCount } from '../../lib/data/transitdata/config.json';

	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	let {
		selectedStation,
		employmentData,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();
</script>

<div class="tab-content">
	<TransitMetric
		label={EmployeeCount.label}
		active={selectedVariable === EmployeeCount.key}
		onclick={() =>
			onSelectVariable(selectedVariable !== EmployeeCount.key ? EmployeeCount.key : null)}
		value={Math.round(selectedStation[EmployeeCount.key]).toLocaleString()}
		icon={EmployeeCount.icon}
	/>
	<div class="tab-chart-container">
		<div class="tab-chart">
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
