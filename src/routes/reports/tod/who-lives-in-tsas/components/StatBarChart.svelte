<script>
	import { BarChart } from '@onsvisual/svelte-charts';

	export let title = '';
	export let data = [];
	export let selectedRow = null;
	export let xSuffix = '';
	export let xPrefix = '';
	export let statLabelInside = '';
	export let statLabelOutside = '';
	export let color = '#db3069';

	// Format value for display: prepend prefix and append suffix
	function formatValue(value) {
		const rounded = Math.round(value).toLocaleString();
		return `${xPrefix}${rounded}${xSuffix}`;
	}
</script>

<div class="single-chart">
	<h4 class="chart-title p-2">{title}</h4>
	<BarChart
		colors={[color]}
		{data}
		xKey="value"
		yKey="label"
		yMax={xSuffix === '%' ? 100 : undefined}
		{xSuffix}
		padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
	/>
	<div class="p-2">
		<p class="stat-header" style="color: var(--brandDarkBlue);">{selectedRow.TSANAME ?? ''}</p>
		<span class="stat" style="color: {color};">{formatValue(data[0]?.value ?? 0)}</span>
		{statLabelInside}
	</div>
	<div class="p-2">
		<p class="stat-header" style="color: var(--brandDarkBlue);">{selectedRow.CMANAME ?? ''}</p>
		<span class="stat" style="color: {color};">{formatValue(data[1]?.value ?? 0)}</span>
		{statLabelOutside}
	</div>
</div>

<style>
	.chart-title {
		font-size: 20px;
		font-weight: 400;
		color: var(--brandDarkBlue);
	}
	.stat {
		font-size: 24px;
		font-weight: 600;
	}
	.stat-header {
		font-size: 16px;
		font-weight: 600;
	}
</style>
