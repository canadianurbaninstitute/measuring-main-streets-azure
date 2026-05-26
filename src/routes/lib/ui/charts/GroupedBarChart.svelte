<script lang="ts">
	import { format as d3Format } from 'd3-format';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import BarGrouped from '../chartcomponents/BarGrouped.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	interface SeriesConfigItem {
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
		title?: string;
		titleFontSize?: string;
		height?: string;
		minHeight?: string;
		padding?: PaddingConfig;
		seriesConfig?: SeriesConfigItem[];
		formatLabelX?: (d: any) => any;
		visible?: boolean | undefined;
		showTooltip?: boolean;
		wrapLabels?: boolean;
		xLabel?: string;
		yLabel?: string;
		xTicks?: any[] | number | undefined;
		yTicks?: any[] | number | undefined;
		showLegend?: boolean;
		formatTooltipValue?: (d: any) => any;
	}

	let {
		data = [],
		yKey = 'category',
		title = '',
		titleFontSize = '1.1rem',
		height = '400px',
		minHeight = '100%',
		padding = { top: 10, right: 10, bottom: 20, left: 160 },
		seriesConfig = [],
		formatLabelX = (d: any) => d,
		visible = undefined,
		showTooltip = true,
		wrapLabels = false,
		xLabel = '',
		yLabel = '',
		xTicks = undefined,
		yTicks = undefined,
		showLegend = true,
		formatTooltipValue = (d: any) => (isNaN(+d) || d === null ? d : d3Format(',')(d))
	}: Props = $props();

	let found = $state<any>(null);
	let e = $state<MouseEvent | null>(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);

	const computedPadding = $derived(
		innerWidth < 768 ? { ...padding, left: Math.min(padding.left, 100) } : padding
	);
	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedWrapLabels = $derived(innerWidth < 768 ? true : wrapLabels);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);

	const seriesNames = $derived(seriesConfig.map((d) => d.key));
	const seriesColors = $derived(seriesConfig.map((d) => d.color));

	// Dynamically extract all unique category values for LayerCake's Y axis layout domain
	const computedYDomain = $derived(data.map((d) => d[yKey]));

	const xDomain = $derived.by(() => {
		if (data.length === 0 || seriesNames.length === 0) return [0, 0];
		const values = data.flatMap((d) => seriesNames.map((key) => d[key]));
		const min = Math.min(0, ...values);
		const max = Math.max(0, ...values);
		return [min, max * 1.1];
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4 style:font-size={titleFontSize || 'inherit'}>{title}</h4>
	{/if}

	<div class="chart" style:min-height={minHeight} style:height={computedHeight}>
		{#if data.length > 0 && seriesNames.length > 0}
			<LayerCake
				position="absolute"
				padding={computedPadding}
				x={seriesNames}
				y={yKey}
				zScale={scaleOrdinal()}
				zDomain={seriesNames}
				zRange={seriesColors}
				{xDomain}
				yDomain={computedYDomain}
				yScale={scaleBand().paddingInner(0.2).paddingOuter(0.1)}
				yDomainSort={false}
				{data}
			>
				<Svg>
					<AxisX
						tickMarks
						baseline
						snapLabels
						format={formatLabelX}
						label={xLabel}
						ticks={xTicks}
					/>
					<AxisY
						tickMarks
						gridlines={false}
						wrap={computedWrapLabels}
						label={yLabel}
						ticks={yTicks}
					/>
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
		{/if}
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
	/* Styles remain unchanged */
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
		gap: 0.5em;
	}
</style>
