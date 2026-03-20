<script>
	import { scaleOrdinal } from 'd3-scale';
	import { format as d3Format } from 'd3-format';
	import { Html, LayerCake, Svg } from 'layercake';

	import Pie from '../chartcomponents/Pie.svelte';
	import QuadTree from '../chartcomponents/QuadTree.html.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	let {
		data = [],
		xKey = 'label',
		yKey = 'value',
		title = '',
		seriesConfig = [],
		height = '450px',
		innerRadius = 0,
		showTooltip = false,
		formatTooltipValue = (d) => (isNaN(+d) || d === null ? d : d3Format(',.1f')(d) + '%')
	} = $props();

	/* ───────────────────────────────────
	 * Reactive / Derived State
	 * ─────────────────────────────────── */

	const seriesNames = $derived(seriesConfig.map((s) => s.key));
	const seriesColors = $derived(seriesConfig.map((s) => s.color));

	const defaultColors = ['#58e965', '#00adf2', '#DB3069', '#002940', '#ff007f', '#f59e0b'];

	// Format data for the chart (ensure numeric values)
	const chartData = $derived(
		data.map((d) => ({
			...d,
			[yKey]: typeof d[yKey] === 'string' ? +d[yKey] : d[yKey]
		}))
	);

	$inspect(chartData).with(console.log);
</script>

	<div class="chart-container">
	{#if title}
		<h4 class="chart-title">{title}</h4>
	{/if}

	<div 
		class="chart" 
		style="height: {height}; min-height: 200px; background: #fafafa; border: 1px dashed #ddd; position: relative;"
	>
		<LayerCake
			data={chartData}
			x={xKey}
			y={yKey}
			z={xKey}
			zScale={scaleOrdinal()}
			zRange={seriesColors.length > 0 ? seriesColors : defaultColors}
		>
			<Svg overflow="visible">
				<Pie {innerRadius} />
			</Svg>

			{#if showTooltip}
				<Html pointerEvents={false}>
					<QuadTree let:found let:visible let:e>
						{#if visible && found && e}
							<ChartTooltip {found} {e} titleKey={xKey} valueKey={yKey} formatValue={formatTooltipValue} />
						{/if}
					</QuadTree>
				</Html>
			{/if}
		</LayerCake>
	</div>

	{#if seriesConfig.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each seriesConfig as { label, color }}
					<LegendItem variant="polygon" {label} bgcolor={color} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.chart {
		width: 100%;
		display: block;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
		width: 100%;
	}

	.controls {
		display: flex;
		flex-direction: column;
	}

	.legend-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border-radius: 0.5em;
		border: 1px solid var(--brandGrey);
		margin: 1em 0 0 0;
		padding: 0.5em;
	}
</style>
