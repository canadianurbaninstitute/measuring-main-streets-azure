<script lang="ts">
	import { format } from 'd3-format';
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3-time-format';
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import MultiArea from '../chartcomponents/MultiArea.svelte';
	import MultiLine from '../chartcomponents/MultiLine.svelte';
	import SharedTooltip from '../chartcomponents/SharedTooltip.html.svelte';
	import TotalLine from '../chartcomponents/TotalLine.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	interface SeriesConfigItem {
		key: string;
		color: string;
		label: string;
	}

	interface Props {
		data?: Record<string, any>[] | undefined;
		seriesConfig?: SeriesConfigItem[];
		title?: string;
		xKey?: string;
		minHeight?: string;
		xParseFn?: ((dateString: string) => Date | null) | null;
		formatLabelX?: (date: Date) => string;
		formatLabelY?: (value: number) => string;
		formatValue?: (value: number) => string;
		yDomain?: [number | null, number | null];
		xTickInterval?: number;
		ticks?: any[] | undefined;
		height?: string;
		visible?: boolean | undefined;
		showLegend?: boolean;
		xLabel?: string;
		yLabel?: string;
		cumulative?: boolean;
		stacked?: boolean;
		showArea?: boolean;
		showLines?: boolean;
		showTotalLine?: boolean;
		totalLineColor?: string;
		totalLineLabel?: string;
		showTooltipTotal?: boolean;
	}

	let {
		data = [],
		seriesConfig = [],
		title = '',
		xKey = 'date',
		minHeight = '100%',
		xParseFn = timeParse('%Y-%m-%d'),
		formatLabelX = timeFormat('%b %Y'),
		formatLabelY = (d: number) => format('~s')(d) + '%',
		formatValue = (d: number) => d.toFixed(0) + '%',
		yDomain = [0, null],
		xTickInterval = 10,
		ticks = undefined,
		height = '500px',
		visible = undefined,
		showLegend = true,
		xLabel = '',
		yLabel = '',
		cumulative = false,
		stacked = false,
		showArea = false,
		showLines = true,
		showTotalLine = false,
		totalLineColor = '#000000',
		totalLineLabel = 'Net Total',
		showTooltipTotal = true
	}: Props = $props();

	const yKey = 'value';
	const zKey = 'key';

	let innerWidth = $state(1000);
	let innerHeight = $state(800);

	const seriesNames = $derived(seriesConfig.map((s) => s.key));
	const seriesColors = $derived(seriesConfig.map((s) => s.color));

	const processedData = $derived(
		data
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
			.sort((a, b) => (a[xKey] as any) - (b[xKey] as any))
	);

	const finalData = $derived.by(() => {
		let result = processedData.map((d) => ({ ...d }));

		if (stacked) {
			let posSums = new Array(result.length).fill(0);
			let negSums = new Array(result.length).fill(0);

			result.forEach((row: Record<string, any>, i) => {
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
					row[name] = row._stack[name].y1;
				});
				row._total = posSums[i] + negSums[i];
			});
		} else {
			result.forEach((row: Record<string, any>) => {
				let sum = 0;
				seriesNames.forEach((name) => {
					sum += row[name] || 0;
				});
				row._total = sum;
			});
		}

		if (cumulative) {
			let runningSums: Record<string, number> = {};
			seriesNames.forEach((name) => (runningSums[name] = 0));

			result.forEach((row: Record<string, any>) => {
				seriesNames.forEach((name) => {
					runningSums[name] += row[name] || 0;
					row[name] = runningSums[name];
				});
				let sum = 0;
				seriesNames.forEach((name) => {
					sum += row[name] || 0;
				});
				row._total = sum;
			});
		}

		return result;
	});

	const groupedData = $derived(
		finalData.length > 0
			? groupLonger(finalData, seriesNames, { groupTo: zKey, valueTo: yKey })
			: []
	);

	const xTicks = $derived(finalData.filter((_, i) => i % xTickInterval === 0).map((d) => d[xKey]));

	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	{#if data.length > 0}
		<div class="chart" style="min-height: {minHeight}; height: {computedHeight};">
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
						<LegendItem variant={showArea ? 'polygon' : 'line'} {label} bgcolor={color} />
					{/each}
					{#if showTotalLine}
						<LegendItem
							bgcolor={totalLineColor ?? '#000000'}
							variant="line"
							label={totalLineLabel}
							bordercolor={totalLineColor}
						/>
					{/if}
				</div>
			</div>
		{/if}
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
