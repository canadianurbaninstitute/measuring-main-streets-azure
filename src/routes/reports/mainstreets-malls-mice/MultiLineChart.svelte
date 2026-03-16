<script>
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';
	import { format } from 'd3-format';
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3-time-format';

	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import AxisX from '../../lib/ui/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/ui/chartcomponents/AxisY.svelte';
	import MultiLine from '../../lib/ui/chartcomponents/MultiLine.svelte';
	import SharedTooltip from '../../lib/ui/chartcomponents/SharedTooltip.html.svelte';

	import ecommerce from '../../lib/data/reportdata/mainstreets-malls-mice/ecommerce.csv';
	import restaurant from '../../lib/data/reportdata/mainstreets-malls-mice/restaurant.csv';

	// ── Backward-compat prop ─────────────────────────────────────────────────────
	/** @deprecated Use `data` + `seriesConfig` instead */
	export let chartDataset = null;

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

	// ── Shim: map legacy chartDataset to new props ───────────────────────────────
	const PRESETS = {
		ecommerce: {
			data: ecommerce,
			seriesConfig: [
				{ key: 'percent', label: 'E-Commerce Share of All Retail Sales', color: '#002940' },
				{ key: 'trend', label: 'Pre-Pandemic Trendline', color: '#DB3069' }
			]
		},
		restaurant: {
			data: restaurant,
			seriesConfig: [
				{ key: 'drinking places', label: 'Drinking Places', color: '#002940' },
				{ key: 'full service restaurants', label: 'Full Service Restaurants', color: '#DB3069' },
				{
					key: 'limited service eating places',
					label: 'Limited Service Eating Places',
					color: '#00ADF2'
				}
			]
		}
	};

	$: if (chartDataset && PRESETS[chartDataset]) {
		data = PRESETS[chartDataset].data;
		seriesConfig = PRESETS[chartDataset].seriesConfig;
	}

	// ── Internal constants ───────────────────────────────────────────────────────
	const yKey = 'value';
	const zKey = 'color';

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

	<div class="chart">
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
				<MultiLine />
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
		height: 500px;
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
