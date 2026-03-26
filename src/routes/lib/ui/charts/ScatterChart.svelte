<script>
	import { scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import { format as d3Format } from 'd3-format';
	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import ReferenceLine from '../chartcomponents/ReferenceLine.svg.svelte';
	import Scatter from '../chartcomponents/Scatter.svg.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	let {
		data = [],
		xKey = 'x',
		yKey = 'y',
		zKey = null,
		title = '',
		height = '500px',
		padding = { top: 10, right: 10, bottom: 20, left: 35 },
		seriesConfig = [],
		xDomain = [null, null],
		yDomain = [null, null],
		pointColor = '#00adf2',
		pointRadius = 5, // Fixed radius instead
		referenceLine = null, // { x1, y1, x2, y2, stroke, strokeWidth, strokeDasharray }
		formatLabelX = (d) => d,
		formatLabelY = (d) => d,
		xLabel = 'X',
		yLabel = 'Y',
		formatTooltipValue = (d) => (isNaN(+d) || d === null ? d : d3Format(',.1f')(d)),
		showTooltip = false,
		visible = true,
		xTicks = undefined,
		yTicks = undefined,
		showLabels = false,
		labelKey = null,
		showLegend = true
	} = $props();

	let found = $state(null);
	let e = $state(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);
	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);
	const computedPadding = $derived(
		innerWidth < 768 ? { ...padding, left: Math.min(padding.left, 45) } : padding
	);

	const seriesNames = $derived(seriesConfig.map((d) => d.key));
	const seriesColors = $derived(seriesConfig.map((d) => d.color));

	const processedData = $derived(
		data.map((d) => {
			const obj = { ...d };
			obj[xKey] = +d[xKey];
			obj[yKey] = +d[yKey];
			return obj;
		})
	);

	const useZScale = $derived(zKey && seriesNames.length > 0);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style:height={computedHeight}>
		<LayerCake
			padding={computedPadding}
			x={xKey}
			y={yKey}
			z={useZScale ? zKey : null}
			{xDomain}
			{yDomain}
			zDomain={useZScale ? seriesNames : null}
			zRange={useZScale ? seriesColors : null}
			zScale={scaleOrdinal()}
			data={processedData}
		>
			<Svg>
				<AxisX tickMarks baseline snapLabels format={formatLabelX} label={xLabel} ticks={xTicks} />
				<AxisY tickMarks gridlines={false} format={formatLabelY} label={yLabel} ticks={yTicks} />
				{#if referenceLine}
					<ReferenceLine {...referenceLine} />
				{/if}
				<Scatter
					{visible}
					bind:found
					bind:e
					fill={pointColor}
					r={pointRadius}
					{showLabels}
					{labelKey}
				/>
			</Svg>

			{#if showTooltip}
				<Html pointerEvents={false}>
					{#if found && e}
						<ChartTooltip
							{found}
							{e}
							titleKey={zKey || xKey}
							{xKey}
							{yKey}
							{xLabel}
							{yLabel}
							formatValue={formatTooltipValue}
						/>
					{/if}
				</Html>
			{/if}
		</LayerCake>
	</div>

	{#if computedShowLegend && seriesConfig.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each seriesConfig as { label, color }}
					<LegendItem variant={'circle'} {label} bgcolor={color} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.chart {
		width: 100%;
		position: relative;
		overflow: visible;
		flex: 1;
		min-height: 250px;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
		height: 100%;
		box-sizing: border-box;
	}

	@media only screen and (min-width: 768px) {
		.chart-container {
			gap: 2em;
		}
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
		border: 1px solid var(--brandGrey, #ccc);
		margin: 1em 0 0 0;
		padding: 0.5em;
		gap: 0.8em;
	}
</style>
