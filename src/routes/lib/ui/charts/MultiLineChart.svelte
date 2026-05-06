<script>
	import { format } from 'd3-format';
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3-time-format';
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import MultiArea from '../chartcomponents/MultiArea.svelte';
	import MultiLine from '../chartcomponents/MultiLine.svelte';
	import TotalLine from '../chartcomponents/TotalLine.svelte';
	import SharedTooltip from '../chartcomponents/SharedTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	// ── Props ──────────────────────────────────────────────────────────────────
	export let data = [];
	export let seriesConfig = [];
	export let title = '';
	export let xKey = 'date';
	export let minHeight = '100%';
	export let xParseFn = timeParse('%Y-%m-%d');
	export let formatLabelX = timeFormat('%b %Y');
	export let formatLabelY = (d) => format('~s')(d) + '%';
	export let formatValue = (d) => d.toFixed(0) + '%';
	export let yDomain = [0, null];
	export let xTickInterval = 10;
	export let ticks = undefined;
	export let height = '500px';
	export let visible = undefined;
	export let showLegend = true;
	export let xLabel = '';
	export let yLabel = '';
	export let cumulative = false;
	export let stacked = false;
	export let showArea = false;
	export let showLines = true;
	export let showTotalLine = false;
	export let totalLineColor = '#000000';
	export let totalLineLabel = 'Net Total';
	export let showTooltipTotal = true;

	// ── Internal constants ───────────────────────────────────────────────────────
	const yKey = 'value'; // LayerCake's yKey after groupLonger
	const zKey = 'key'; // LayerCake's zKey for line colors

	$: seriesNames = seriesConfig.map((s) => s.key);
	$: seriesColors = seriesConfig.map((s) => s.color);

	// 1. Process data: parse dates and ensure all series values are numbers
	$: processedData = data
		.map((d) => {
			const newD = { ...d };
			if (xParseFn && typeof newD[xKey] === 'string') {
				newD[xKey] = xParseFn(newD[xKey]);
			}
			seriesNames.forEach((name) => {
				const val = parseFloat(newD[name]);
				newD[name] = isNaN(val) ? 0 : val;
			});
			return newD;
		})
		.sort((a, b) => a[xKey] - b[xKey]);

	// 2. Apply Stacking and Cumulative logic
	$: finalData = (() => {
		// Create a fresh copy to avoid mutating processedData
		let result = processedData.map((d) => ({ ...d }));

		// Apply stacking
		if (stacked) {
			let posSums = new Array(result.length).fill(0);
			let negSums = new Array(result.length).fill(0);

			result.forEach((row, i) => {
				row._stack = {};
				row._original = {};
				seriesNames.forEach((name) => {
					const val = row[name] || 0;
					row._original[name] = val;

					if (val >= 0) {
						row._stack[name] = { y0: posSums[i], y1: posSums[i] + val };
						posSums[i] += val;
					} else {
						row._stack[name] = { y0: negSums[i], y1: negSums[i] + val };
						negSums[i] += val;
					}
					// Use y1 as the point value for line drawing and scaling
					row[name] = row._stack[name].y1;
				});
				row._total = posSums[i] + negSums[i];
			});
		} else {
			// If not stacked, still calculate total for the line if needed
			result.forEach((row) => {
				let sum = 0;
				seriesNames.forEach((name) => {
					sum += row[name] || 0;
				});
				row._total = sum;
			});
		}

		// Apply cumulative
		if (cumulative) {
			let runningSums = {};
			seriesNames.forEach((name) => (runningSums[name] = 0));

			result.forEach((row) => {
				seriesNames.forEach((name) => {
					runningSums[name] += row[name] || 0;
					row[name] = runningSums[name];
				});
				// Update total for cumulative view as well
				let sum = 0;
				seriesNames.forEach((name) => {
					sum += row[name] || 0;
				});
				row._total = sum;
			});
		}

		return result;
	})();

	$: groupedData = groupLonger(finalData, seriesNames, { groupTo: zKey, valueTo: yKey });
	$: xTicks = finalData.filter((_, i) => i % xTickInterval === 0).map((d) => d[xKey]);

	let innerWidth = 1000;
	let innerHeight = 800;
	$: computedHeight = innerWidth < 768 ? '100%' : height;
	$: computedShowLegend = innerHeight < 900 ? false : showLegend;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style="min-height: {minHeight}">
		<LayerCake
			position="absolute"
			padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			{yDomain}
			zDomain={seriesNames}
			zScale={scaleOrdinal()}
			xScale={scaleTime()}
			zRange={seriesColors}
			flatData={flatten(groupedData, 'values')}
			data={groupedData}
		>
			<Svg>
				<AxisX
					gridlines={false}
					ticks={ticks || xTicks}
					format={formatLabelX}
					tickMarks
					label={xLabel}
				/>
				<AxisY ticks={4} format={formatLabelY} label={yLabel} />
				{#if showArea}
					<MultiArea {visible} opacity={0.3} />
				{/if}
				{#if showLines}
					<MultiLine {visible} />
				{/if}

				{#if showTotalLine}
					<TotalLine
						dataset={finalData}
						yKey="_total"
						stroke={totalLineColor}
						strokeWidth={4}
						dashed={true}
						{visible}
					/>
				{/if}
			</Svg>

			<Html>
				<SharedTooltip
					formatTitle={formatLabelX}
					dataset={finalData}
					{formatValue}
					showTotal={showTooltipTotal}
				/>
			</Html>
		</LayerCake>
	</div>

	{#if computedShowLegend && (seriesConfig.length > 0 || showTotalLine)}
		<div class="controls">
			<div class="legend-container">
				{#each seriesConfig as { label, color }}
					<!-- Use 'polygon' for areas and 'line' for lines -->
					<LegendItem variant={showArea ? 'polygon' : 'line'} {label} bgcolor={color} />
				{/each}
				{#if showTotalLine}
					<LegendItem variant="line" label={totalLineLabel} bordercolor={totalLineColor} dotted />
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.chart {
		width: 100%;
		flex: 1;
		position: relative;
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
	}
</style>
