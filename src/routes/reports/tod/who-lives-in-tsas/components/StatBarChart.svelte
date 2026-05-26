<script lang="ts">
	//@ts-ignore-next-line
	import { BarChart } from '@onsvisual/svelte-charts';

	interface Props {
		title?: string;
		description?: string;
		data?: { label: string; value: number; [key: string]: any }[];
		selectedRow?: {
			TSANAME?: string;
			CMANAME?: string;
			[key: string]: any;
		} | null;
		xSuffix?: string;
		xPrefix?: string;
		statLabelInside?: string;
		statLabelOutside?: string;
		color?: string;
	}

	let {
		title = '',
		description = '',
		data = [],
		selectedRow = null,
		xSuffix = '',
		xPrefix = '',
		statLabelInside = '',
		statLabelOutside = '',
		color = '#db3069'
	}: Props = $props();

	// Format value for display: prepend prefix and append suffix
	function formatValue(value: number) {
		const rounded = Math.round(value).toLocaleString();
		return `${xPrefix}${rounded}${xSuffix}`;
	}
</script>

<div class="single-chart">
	{#if title}
		<h4 class="chart-title p-2">{title}</h4>
	{/if}
	{#if description}
		<div class="p-2">{description}</div>
	{/if}

	{#if data.length > 0}
		<BarChart
			colors={[color]}
			{data}
			xKey="value"
			yKey="label"
			yMax={xSuffix === '%' ? 100 : undefined}
			{xSuffix}
			padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
		/>
	{/if}

	{#if selectedRow}
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
	{/if}
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
