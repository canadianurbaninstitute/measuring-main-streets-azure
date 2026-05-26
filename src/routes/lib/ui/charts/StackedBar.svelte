<script lang="ts">
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg, flatten, stack } from 'layercake';

	import { format as d3Format } from 'd3-format';
	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import BarStacked from '../chartcomponents/BarStacked.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	interface SeriesItem {
		label: string;
		color: string;
		key: string;
	}

	interface PaddingConfig {
		top?: number;
		right?: number;
		bottom?: number;
		left: number;
	}

	interface Props {
		data?: Record<string, any>[];
		yKey?: string;
		zKey?: string;
		title?: string;
		titleFontSize?: string;
		minHeight?: string;
		height?: string;
		padding?: PaddingConfig;
		seriesConfig?: SeriesItem[];
		formatLabelX?: (d: any) => any;
		visible?: boolean | undefined;
		showTooltip?: boolean;
		wrapLabels?: boolean;
		xLabel?: string;
		yLabel?: string;
		xTicks?: number | any[] | ((defaultTicks: any[]) => any[]) | undefined;
		yTicks?: number | any[] | ((defaultTicks: any[]) => any[]) | undefined;
		showLegend?: boolean;
		formatTooltipValue?: (d: any) => any;
	}

	let {
		data = [],
		yKey = 'name',
		zKey = 'key',
		title = '',
		titleFontSize = '1.1rem',
		minHeight = '100%',
		height = '400px',
		padding = { bottom: 20, left: 35 },
		seriesConfig = [],
		formatLabelX = (d: any) => d,
		visible = undefined,
		showTooltip = false,
		wrapLabels = false,
		xLabel = '',
		yLabel = '',
		xTicks = undefined,
		yTicks = undefined,
		showLegend = true,
		formatTooltipValue = (d: any) => (isNaN(+d) || d === null ? d : d3Format(',.1f')(d) + '%')
	}: Props = $props();

	let found = $state<any>(null);
	let e = $state<MouseEvent | null>(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);

	const computedPadding = $derived(
		innerWidth < 768 ? { ...padding, left: Math.min(padding.left, 100) } : padding
	);
	const computedWrapLabels = $derived(innerWidth < 768 ? true : wrapLabels);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);

	const xKey = [0, 1];

	const seriesNames = $derived(seriesConfig.map((d) => d.key));
	const seriesColors = $derived(seriesConfig.map((d) => d.color));

	const processedData = $derived(
		data.map((d) => {
			const obj: Record<string, any> = { ...d };
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
		<h4 style="font-size: {titleFontSize}">{title}</h4>
	{/if}

	<div class="chart" style="min-height: {minHeight}; height: {height};">
		<LayerCake
			position="absolute"
			padding={computedPadding}
			x={xKey}
			y={(d: any) => d.data[yKey]}
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
		flex-direction: column;
		justify-content: flex-start;
		gap: 0.5em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 0.5em;
		box-sizing: border-box;
		background: white;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		height: 100%;
	}

	h4 {
		font-family: 'Inter', sans-serif;
		color: var(--brandDarkBlue);
		letter-spacing: -0.01em;
		line-height: 120%;
		font-weight: 300;
		text-transform: uppercase;
		max-width: 80ch;
		margin: 0;
	}

	@media only screen and (min-width: 768px) {
		.chart-container {
			gap: 1em;
			padding: 1.5em;
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
