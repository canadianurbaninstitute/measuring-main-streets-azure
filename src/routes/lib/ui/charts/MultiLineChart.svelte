<script>
	import { format } from 'd3-format';
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3-time-format';
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import MultiLine from '../chartcomponents/MultiLine.svelte';
	import SharedTooltip from '../chartcomponents/SharedTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	// ── New generalized props ────────────────────────────────────────────────────
	export let data = [];
	export let seriesConfig = [];
	export let title = '';
	export let xKey = 'date';
	export let xParseFn = timeParse('%Y-%m-%d');
	export let formatLabelX = timeFormat('%b %Y');
	export let formatLabelY = (d) => format('~s')(d) + '%';
	export let formatValue = (d) => d.toFixed(0) + '%';
	export let yDomain = [0, null];
	export let xTickInterval = 10;
	export let height = '500px';
	export let visible = false;

	// ── Internal constants ───────────────────────────────────────────────────────
	const yKey = 'value'; // LayerCake's yKey after groupLonger
	const zKey = 'color'; // LayerCake's zKey for line colors

	$: seriesNames = seriesConfig.map((s) => s.key);
	$: seriesColors = seriesConfig.map((s) => s.color);

	$: {
		data.forEach((d) => {
			if (xParseFn && typeof d[xKey] === 'string') d[xKey] = xParseFn(d[xKey]);
			seriesNames.forEach((name) => {
				if (typeof d[name] === 'string') d[name] = +d[name];
			});
		});
	}

	$: groupedData = groupLonger(data, seriesNames, { groupTo: zKey, valueTo: yKey });
	$: xTicks = data.filter((_, i) => i % xTickInterval === 0).map((d) => d[xKey]);
</script>

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style:height>
		<LayerCake
			padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			{yDomain}
			zScale={scaleOrdinal()}
			xScale={scaleTime()}
			zRange={seriesColors}
			flatData={flatten(groupedData, 'values')}
			data={groupedData}
		>
			<Svg>
				<AxisX gridlines={false} ticks={xTicks} format={formatLabelX} tickMarks />
				<AxisY ticks={4} format={formatLabelY} />
				<MultiLine {visible} />
			</Svg>
			<Html>
				<SharedTooltip formatTitle={formatLabelX} dataset={data} {formatValue} />
			</Html>
		</LayerCake>
	</div>

	{#if seriesConfig.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each seriesConfig as { label, color }}
					<LegendItem variant="line" {label} bordercolor={color} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.chart {
		width: 100%;
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
		border: 1px solid var(--brandGrey);
		margin: 1em 0 0 0;
		padding: 0.5em;
	}
</style>
