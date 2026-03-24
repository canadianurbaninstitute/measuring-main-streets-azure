<script>
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { format as d3Format } from 'd3-format';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import BarGrouped from '../chartcomponents/BarGrouped.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	let {
		data = [],
		yKey = 'category',
		title = '',
		height = '400px',
		padding = { top: 10, right: 10, bottom: 20, left: 160 },
		seriesConfig = [], // Array of { label, color, key }
		formatLabelX = (d) => d,
		visible = true,
		showTooltip = true,
		wrapLabels = false,
		xLabel = '',
		yLabel = '',
		xTicks = undefined,
		yTicks = undefined,
		formatTooltipValue = (d) => (isNaN(+d) || d === null ? d : d3Format(',')(d))
	} = $props();

	let found = $state(null);
	let e = $state(null);

	const seriesNames = $derived(seriesConfig.map((d) => d.key));
	const seriesColors = $derived(seriesConfig.map((d) => d.color));

	// Calculate overall min/max to ensure X scale covers negative values if any
	const xDomain = $derived.by(() => {
		const values = data.flatMap((d) => seriesNames.map((key) => d[key]));
		const min = Math.min(0, ...values);
		const max = Math.max(0, ...values);
		return [min, max * 1.1]; // Add 10% buffer
	});
</script>

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style:height>
		<LayerCake
			{padding}
			x={seriesNames}
			y={yKey}
			zScale={scaleOrdinal()}
			zDomain={seriesNames}
			zRange={seriesColors}
			xDomain={xDomain}
			yScale={scaleBand().paddingInner(0.2).paddingOuter(0.1)}
			yDomainSort={false}
			{data}
		>
			<Svg>
				<AxisX tickMarks baseline snapLabels format={formatLabelX} label={xLabel} ticks={xTicks} />
				<AxisY tickMarks gridlines={false} wrap={wrapLabels} label={yLabel} ticks={yTicks} />
				<BarGrouped bind:found bind:e {visible} />
			</Svg>

			{#if showTooltip}
				<Html pointerEvents={false}>
					{#if found && e}
						<ChartTooltip
							{found}
							{e}
							titleKey={yKey}
							valueKey={found._key}
							formatValue={formatTooltipValue}
						/>
					{/if}
				</Html>
			{/if}
		</LayerCake>
	</div>

	{#if seriesConfig.length > 0}
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
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
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
		gap: 0.5em;
	}
</style>
