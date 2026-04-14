<script>
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg, flatten, stack } from 'layercake';

	import { format as d3Format } from 'd3-format';
	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import BarStacked from '../chartcomponents/BarStacked.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	let {
		data = [],
		yKey = 'name',
		zKey = 'key',
		title = '',
		minHeight = '100%',
		height = '400px',
		padding = { bottom: 20, left: 35 },
		seriesConfig = [], // Array of { label, color, key }
		formatLabelX = (d) => d,
		visible = undefined,
		showTooltip = false,
		wrapLabels = false,
		xLabel = '',
		yLabel = '',
		xTicks = undefined,
		yTicks = undefined,
		showLegend = true,
		formatTooltipValue = (d) => (isNaN(+d) || d === null ? d : d3Format(',.1f')(d) + '%')
	} = $props();
	let found = $state(null);
	let e = $state(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);
	const computedPadding = $derived(
		innerWidth < 768 ? { ...padding, left: Math.min(padding.left, 100) } : padding
	);
	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedWrapLabels = $derived(innerWidth < 768 ? true : wrapLabels);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);

	const xKey = [0, 1];

	const seriesNames = $derived(seriesConfig.map((d) => d.key));
	const seriesColors = $derived(seriesConfig.map((d) => d.color));

	const processedData = $derived(
		data.map((d) => {
			const obj = { ...d };
			seriesNames.forEach((name) => {
				obj[name] = +d[name];
			});
			return obj;
		})
	);

	const stackedData = $derived(stack(processedData, seriesNames));
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style="min-height: {minHeight}">
		<LayerCake
			position="absolute"
			padding={computedPadding}
			x={xKey}
			y={(d) => d.data[yKey]}
			z={zKey}
			yScale={scaleBand().paddingInner(0.05)}
			zScale={scaleOrdinal()}
			zDomain={seriesNames}
			zRange={seriesColors}
			flatData={flatten(stackedData)}
			data={stackedData}
			yDomainSort={false}
		>
			<Svg>
				<AxisX tickMarks baseline snapLabels format={formatLabelX} label={xLabel} ticks={xTicks} />
				<AxisY
					tickMarks
					gridlines={false}
					wrap={computedWrapLabels}
					label={yLabel}
					ticks={yTicks}
				/>
				<BarStacked bind:found bind:e {visible} />
			</Svg>

			{#if showTooltip}
				<Html pointerEvents={false}>
					{#if found && e}
						<ChartTooltip
							{found}
							{e}
							titleKey={yKey}
							{seriesConfig}
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
					<LegendItem variant={'polygon'} {label} bgcolor={color} />
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
	}

	.chart-container {
		display: flex;
		min-height: 250px;
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
		border: 1px solid var(--brandGrey);
		margin: 1em 0 0 0;
		padding: 0.5em;
		gap: 0.5em;
	}
</style>
