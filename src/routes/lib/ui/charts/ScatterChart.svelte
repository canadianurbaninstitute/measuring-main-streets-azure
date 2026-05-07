<script>
	import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import Quadrants from '../chartcomponents/Quadrants.svelte';
	import ReferenceLine from '../chartcomponents/ReferenceLine.svg.svelte';
	import Scatter from '../chartcomponents/Scatter.svg.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	let props = $props();

	let found = $state(null);
	let e = $state(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);

	const computedHeight = $derived(innerWidth < 768 ? '100%' : props.height || '500px');
	const computedShowLegend = $derived(innerHeight < 900 ? false : (props.showLegend ?? true));
	const computedPadding = $derived(
		innerWidth < 768
			? { ...(props.padding || {}), left: Math.min(props.padding?.left || 35, 45) }
			: props.padding || { top: 10, right: 10, bottom: 20, left: 35 }
	);

	const seriesNames = $derived((props.seriesConfig || []).map((d) => d.key));
	const seriesColors = $derived((props.seriesConfig || []).map((d) => d.color));

	const processedData = $derived(
		(props.data || []).map((d) => {
			const obj = { ...d };
			const xKey = props.xKey || 'x';
			const yKey = props.yKey || 'y';
			obj[xKey] = +d[xKey];
			obj[yKey] = +d[yKey];
			return obj;
		})
	);

	const useZScale = $derived(props.zKey && seriesNames.length > 0);

	const computedXScale = $derived(
		typeof (props.xScale || scaleLinear).copy === 'function'
			? props.xScale || scaleLinear
			: (props.xScale || scaleLinear)()
	);
	const computedYScale = $derived(
		typeof (props.yScale || scaleLinear).copy === 'function'
			? props.yScale || scaleLinear
			: (props.yScale || scaleLinear)()
	);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if props.title}
		<h4>{props.title}</h4>
	{/if}

	<div class="chart" style:height={computedHeight}>
		{#if innerWidth > 0 && processedData.length > 0}
			<LayerCake
				position="absolute"
				padding={computedPadding}
				x={props.xKey || 'x'}
				y={props.yKey || 'y'}
				z={useZScale ? props.zKey : undefined}
				xDomain={props.xDomain || [null, null]}
				yDomain={props.yDomain || [null, null]}
				xScale={computedXScale}
				yScale={computedYScale}
				zDomain={useZScale ? seriesNames : undefined}
				zRange={useZScale ? seriesColors : undefined}
				zScale={useZScale ? scaleOrdinal() : undefined}
				data={$state.snapshot(processedData)}
			>
				<Svg>
					<AxisX
						tickMarks
						baseline
						snapLabels
						format={props.formatLabelX}
						label={props.xLabel}
						ticks={props.xTicks}
						gridlines={!props.showQuadrants}
					/>
					<AxisY
						tickMarks
						gridlines={!props.showQuadrants}
						format={props.formatLabelY}
						label={props.yLabel}
						ticks={props.yTicks}
					/>
					{#if props.showQuadrants}
						<Quadrants
							xMid={props.quadrantConfig?.xMid}
							yMid={props.quadrantConfig?.yMid}
							labels={props.quadrantConfig?.labels}
							colors={props.quadrantConfig?.colors}
							stroke={props.quadrantConfig?.stroke}
							strokeDasharray={props.quadrantConfig?.strokeDasharray}
						/>
					{/if}
					{#if props.referenceLine}
						<ReferenceLine {...props.referenceLine} />
					{/if}
					<Scatter
						visible={props.visible}
						bind:found
						bind:e
						fill={props.pointColor || '#00adf2'}
						r={props.pointRadius || 5}
						showLabels={props.showLabels}
						labelKey={props.labelKey}
						highlightIds={props.highlightIds}
						idKey={props.idKey}
						filterRegion={props.filterRegion}
						regionKey={props.regionKey}
					/>
				</Svg>

				{#if props.showTooltip}
					<Html pointerEvents={false}>
						{#if found && e}
							<ChartTooltip
								{found}
								{e}
								titleKey={props.titleKey || props.zKey || props.xKey || 'x'}
								xKey={props.xKey || 'x'}
								yKey={props.yKey || 'y'}
								xLabel={props.xLabel || 'X'}
								yLabel={props.yLabel || 'Y'}
								formatValue={props.formatTooltipValue}
								tooltipRows={props.tooltipRows}
							/>
						{/if}
					</Html>
				{/if}
			</LayerCake>
		{/if}
	</div>

	{#if computedShowLegend && (props.seriesConfig || []).length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each props.seriesConfig as { label, color }}
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
		min-height: 350px;
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
