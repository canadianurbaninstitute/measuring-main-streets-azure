<script lang="ts">
	import { format as d3Format } from 'd3-format';
	import { scaleOrdinal } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import Pie from '../chartcomponents/Pie.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	interface SeriesItem {
		key: string;
		color: string;
	}

	interface Props {
		data?: Record<string, any>[];
		drilldownData?: Record<string, Record<string, any>[]>;
		xKey?: string;
		yKey?: string;
		title?: string;
		seriesConfig?: SeriesItem[];
		height?: string;
		innerRadius?: number;
		showTooltip?: boolean;
		formatTooltipValue?: (d: any) => any;
		explode?: string[];
		explodeDistance?: number;
		showLegend?: boolean;
		visible?: boolean | undefined;
	}

	let {
		data = [],
		drilldownData = {},
		xKey = 'label',
		yKey = 'value',
		title = '',
		seriesConfig = [],
		height = '450px',
		innerRadius = 0,
		showTooltip = false,
		formatTooltipValue = (d: any) => (isNaN(+d) || d === null ? d : d3Format(',.1f')(d) + '%'),
		explode = [],
		explodeDistance = 20,
		showLegend = true,
		visible = $bindable(undefined)
	}: Props = $props();

	let drillKey = $state<string | null>(null);
	const activeData = $derived(drillKey ? (drilldownData[drillKey] ?? data) : data);

	function handleClick(slice: Record<string, any>) {
		const key = slice[xKey];
		if (drilldownData[key]) {
			drillKey = key;
			visible = false;
			setTimeout(() => {
				visible = true;
			}, 100);
		}
	}

	function reset() {
		drillKey = null;
		visible = false;
		setTimeout(() => {
			visible = true;
		}, 100);
	}

	const isDrilled = $derived(drillKey !== null);
	const seriesColors = $derived(seriesConfig.map((s) => s.color));

	const defaultColors = ['#58e965', '#00adf2', '#DB3069', '#002940', '#ff007f', '#f59e0b'];

	const chartData = $derived(
		activeData.map((d) => ({
			...d,
			[yKey]: typeof d[yKey] === 'string' ? +d[yKey] : d[yKey]
		}))
	);

	let found = $state<Record<string, any> | null>(null);
	let e = $state<MouseEvent | null>(null);
	let innerWidth = $state(1000);
	let innerHeight = $state(800);
	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4 class="chart-title">{isDrilled ? `${title} › ${drillKey}` : title}</h4>
	{/if}

	{#if isDrilled}
		<button class="back-btn" onclick={reset}>← Back</button>
	{/if}

	<div class="chart" style:height={computedHeight}>
		<LayerCake
			position="absolute"
			data={chartData}
			x={xKey}
			y={yKey}
			z={xKey}
			zScale={scaleOrdinal()}
			zDomain={chartData.map((d) => d[xKey])}
			zRange={seriesColors.length > 0 ? seriesColors : defaultColors}
		>
			<Svg>
				<Pie
					{innerRadius}
					bind:found
					bind:e
					{explode}
					{explodeDistance}
					{visible}
					onSliceClick={handleClick}
					drillableKeys={Object.keys(drilldownData)}
				/>
			</Svg>

			{#if showTooltip}
				<Html pointerEvents={false}>
					{#if found && e}
						<ChartTooltip
							{found}
							{e}
							titleKey={xKey}
							valueKey={yKey}
							formatValue={formatTooltipValue}
						/>
					{/if}
				</Html>
			{/if}
		</LayerCake>
	</div>

	{#if computedShowLegend && activeData.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each activeData as { label, color }}
					<LegendItem variant="polygon" {label} bgcolor={color} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.chart {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		flex: 1;
		min-height: 200px;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
		width: 100%;
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
	}

	.back-btn {
		align-self: flex-start;
		background: none;
		border: 1px solid #ccc;
		border-radius: 0.4em;
		padding: 0.3em 0.8em;
		cursor: pointer;
		font-size: 0.85em;
		color: #444;
	}

	.back-btn:hover {
		background: #f5f5f5;
	}
</style>
