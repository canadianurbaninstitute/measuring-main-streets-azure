<script lang="ts">
	// @ts-ignore-next-line
	import { BarChart } from '@onsvisual/svelte-charts';
	import { EmployeeCount } from '../../lib/data/transitdata/config.json';

	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';

	let {
		selectedStation,
		employmentData,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();

	const fr = getLang() === 'fr';
	const pct = fr ? '\u00a0%' : '%';
	const num = (n: number) => (fr ? formatNumber(n, undefined, 'fr') : n.toLocaleString());
	const money = (n: number) =>
		fr ? formatNumber(n, undefined, 'fr') + '\u00a0$' : '$' + n.toLocaleString();
</script>

<div class="tab-content">
	<TransitMetric
		label={trTransit(EmployeeCount.label, fr)}
		active={selectedVariable === EmployeeCount.key}
		onclick={() =>
			onSelectVariable(selectedVariable !== EmployeeCount.key ? EmployeeCount.key : null)}
		value={num(Math.round(selectedStation[EmployeeCount.key]))}
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
				title={fr ? 'Composition de l’emploi' : 'Employment Mix'}
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix={pct}
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
