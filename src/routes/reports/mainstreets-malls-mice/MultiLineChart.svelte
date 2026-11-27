<script>
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { timeParse } from 'd3-time-format';
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';

	import AxisX from '../../lib/ui/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/ui/chartcomponents/AxisY.svelte';
	import MultiLine from '../../lib/ui/chartcomponents/MultiLine.svelte';
	import SharedTooltip from '../../lib/ui/chartcomponents/SharedTooltip.html.svelte';
	import MultiLineChart from '../../lib/ui/charts/MultiLineChart.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import { getLang } from '../../lib/i18n';
	import { frPercentAxis, frPercentValue, frTimeLocale } from './frFormat.js';

	import ecommerce from '../../lib/data/reportdata/mainstreets-malls-mice/ecommerce.csv';
	import restaurant from '../../lib/data/reportdata/mainstreets-malls-mice/restaurant.csv';

	const fr = getLang() === 'fr';

	// ── Backward-compat prop ─────────────────────────────────────────────────────
	/** @deprecated Use `data` + `seriesConfig` instead */
	export let chartDataset = null;

	// ── Inherited generalized props ──────────────────────────────────────────────
	export let data = [];
	export let seriesConfig = [];
	export let title = '';
	export let yDomain = [0, null];

	// ── Shim: map legacy chartDataset to new props ───────────────────────────────
	const PRESETS = {
		ecommerce: {
			data: ecommerce,
			seriesConfig: [
				{
					key: 'percent',
					label: fr
						? 'Part du commerce électronique dans l’ensemble des ventes au détail'
						: 'E-Commerce Share of All Retail Sales',
					color: '#002940'
				},
				{
					key: 'trend',
					label: fr ? 'Tendance prépandémique' : 'Pre-Pandemic Trendline',
					color: '#DB3069'
				}
			]
		},
		restaurant: {
			data: restaurant,
			seriesConfig: [
				{
					key: 'drinking places',
					label: fr ? 'Débits de boissons (alcoolisées)' : 'Drinking Places',
					color: '#002940'
				},
				{
					key: 'full service restaurants',
					label: fr ? 'Restaurants à service complet' : 'Full Service Restaurants',
					color: '#DB3069'
				},
				{
					key: 'limited service eating places',
					label: fr
						? 'Établissements de restauration à service restreint'
						: 'Limited Service Eating Places',
					color: '#00ADF2'
				}
			]
		}
	};

	$: if (chartDataset && PRESETS[chartDataset]) {
		data = PRESETS[chartDataset].data;
		seriesConfig = PRESETS[chartDataset].seriesConfig;
	}

	// ── French rendering ─────────────────────────────────────────────────────────
	// The shared MultiLineChart shows the raw data keys (title-cased) in its tooltip. French pages
	// render the same chart here so the tooltip can show the translated series labels instead.
	const parseDate = timeParse('%Y-%m-%d');
	const xKey = 'date';
	const xTickInterval = 10;

	let innerWidth = 1000;
	let innerHeight = 800;

	$: seriesNames = seriesConfig.map((s) => s.key);
	$: seriesColors = seriesConfig.map((s) => s.color);
	$: seriesLabels = Object.fromEntries(seriesConfig.map((s) => [s.key, s.label]));
	$: frData = fr
		? data
				.map((d) => {
					const row = { ...d };
					if (typeof row[xKey] === 'string') row[xKey] = parseDate(row[xKey]);
					let total = 0;
					seriesNames.forEach((name) => {
						const val = parseFloat(row[name]);
						row[name] = isNaN(val) ? 0 : val;
						total += row[name];
					});
					row._total = total;
					return row;
				})
				.sort((a, b) => a[xKey] - b[xKey])
		: [];
	$: frGrouped =
		frData.length > 0
			? groupLonger(frData, seriesNames, { groupTo: 'key', valueTo: 'value' })
			: [];
	$: frTicks = frData.filter((_, i) => i % xTickInterval === 0).map((d) => d[xKey]);
	const formatLabelX = frTimeLocale.format('%b %Y');
	const formatKey = (/** @type {string} */ k) => seriesLabels[k] ?? k;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if fr}
	<div class="chart-container">
		{#if title}
			<h4>{title}</h4>
		{/if}

		{#if frData.length > 0}
			<div
				class="chart"
				style="min-height: 800px; height: {innerWidth < 768 ? '100%' : '500px'};"
			>
				<LayerCake
					position="absolute"
					padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
					x={xKey}
					y="value"
					z="key"
					{yDomain}
					zDomain={seriesNames}
					zScale={scaleOrdinal()}
					xScale={scaleTime()}
					zRange={seriesColors}
					flatData={flatten(frGrouped, 'values')}
					data={frGrouped}
				>
					<Svg>
						<AxisX gridlines={false} ticks={frTicks} format={formatLabelX} tickMarks />
						<AxisY ticks={4} format={frPercentAxis} />
						<MultiLine />
					</Svg>

					<Html>
						<SharedTooltip
							formatTitle={formatLabelX}
							dataset={frData}
							formatValue={frPercentValue}
							{formatKey}
							showTotal={true}
						/>
					</Html>
				</LayerCake>
			</div>

			{#if innerHeight >= 900 && seriesConfig.length > 0}
				<div class="controls">
					<div class="legend-container">
						{#each seriesConfig as { label, color }}
							<LegendItem variant="line" {label} bgcolor={color} />
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
{:else}
	<MultiLineChart {...$$restProps} {data} {seriesConfig} {title} {yDomain} minHeight="800px" />
{/if}

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
