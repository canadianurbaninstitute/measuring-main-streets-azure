<script>
	import { format as d3Format } from 'd3-format';
	import { scaleBand } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import Bar from '../chartcomponents/Bar.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import QuadTree from '../chartcomponents/QuadTree.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	// ── Props ────────────────────────────────────────────────────────────────────
	export let data = [];
	export let xKey;
	export let yKey = 'name';
	export let groupKey = 'ms_type';
	export let title = '';
	export let titleFontSize = '1.1rem';
	export let xDomain = [0, null];
	export let minHeight = '150px';
	export let height = '250px';
	export let paddingLeft = 160;
	export let paddingRight = 20;
	export let paddingTop = 10;
	export let paddingBottom = 25;
	export let barColor = '#00adf2';
	export let wrapLabels = false;
	export let showTooltip = false;
	export let formatTooltipValue = (d) => d3Format(',')(d);
	export let visible = undefined;
	export let xLabel = '';
	export let yLabel = '';
	export let xTicks = undefined;
	export let yTicks = undefined;
	export let formatLabelX = (d) => d;
	export let formatLabelY = (d) => d;
	export let showLegend = true;
	export let highlightValue = '';
	export let highlightColor = '#f45d01';
	export let barPadding = undefined;

	/**
	 * Configuration for groups, including their data value, legend label, and bar color.
	 */
	export let groupConfig = [];

	let innerWidth = 1000;
	let innerHeight = 800;
	$: computedPaddingLeft = innerWidth < 768 ? Math.max(60, Math.min(paddingLeft, 80)) : paddingLeft;
	$: computedHeight = innerWidth < 768 ? '100%' : height;
	$: computedWrapLabels = innerWidth < 768 ? true : wrapLabels;
	$: computedShowLegend = innerHeight < 900 ? false : showLegend;
	$: computedBarPadding = barPadding !== undefined ? barPadding : data.length > 3 ? 0.1 : 0.3;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4 style:font-size={titleFontSize}>{title}</h4>
	{/if}

	{#if computedShowLegend && groupConfig && groupConfig.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each groupConfig as { label, color }}
					<LegendItem variant={'polygon'} {label} bgcolor={color} />
				{/each}
			</div>
		</div>
	{/if}

	<div class="chart" style:min-height={minHeight}>
		{#if groupConfig && groupConfig.length > 0}
			{#each groupConfig as { value, color }, i}
				<LayerCake
					position="absolute"
					x={xKey}
					y={yKey}
					yDomainSort={false}
					yScale={scaleBand().paddingInner(computedBarPadding)}
					padding={{
						top: paddingTop,
						bottom: paddingBottom,
						left: computedPaddingLeft,
						right: paddingRight
					}}
					{xDomain}
					data={data.filter((d) => d[groupKey] === value)}
					flatData={data}
				>
					<Svg>
						{#if i === 0}
							<AxisX
								tickMark
								baseline
								snapLabels
								label={xLabel}
								ticks={xTicks}
								format={formatLabelX}
							/>
							<AxisY
								tickMarks
								gridlines={false}
								wrap={false}
								label={yLabel}
								ticks={yTicks}
								format={formatLabelY}
							/>
						{/if}
						<Bar fill={color} {visible} {highlightValue} highlightKey={yKey} {highlightColor} />
					</Svg>

					{#if i === groupConfig.length - 1 && showTooltip}
						<Html>
							<QuadTree x="y" y="y" dataset={data} let:found let:visible let:e>
								{#if visible && found && e}
									<ChartTooltip
										{found}
										{e}
										titleKey={yKey}
										valueKey={xKey}
										formatValue={formatTooltipValue}
									/>
								{/if}
							</QuadTree>
						</Html>
					{/if}
				</LayerCake>
			{/each}
		{:else}
			<LayerCake
				position="absolute"
				x={xKey}
				y={yKey}
				yDomainSort={false}
				yScale={scaleBand().paddingInner(computedBarPadding)}
				padding={{
					top: paddingTop,
					bottom: paddingBottom,
					left: computedPaddingLeft,
					right: paddingRight
				}}
				{xDomain}
				{data}
			>
				<Svg>
					<AxisX tickMark baseline snapLabels label={xLabel} ticks={xTicks} format={formatLabelX} />
					<AxisY
						tickMarks
						gridlines={false}
						wrap={computedWrapLabels}
						label={yLabel}
						ticks={yTicks}
						format={formatLabelY}
					/>
					<Bar fill={barColor} {visible} {highlightValue} highlightKey={yKey} {highlightColor} />
				</Svg>

				{#if showTooltip}
					<Html>
						<QuadTree x="y" y="y" let:found let:visible let:e>
							{#if visible && found && e}
								<ChartTooltip
									{found}
									{e}
									titleKey={yKey}
									valueKey={xKey}
									formatValue={formatTooltipValue}
								/>
							{/if}
						</QuadTree>
					</Html>
				{/if}
			</LayerCake>
		{/if}
	</div>
</div>

<style>
	.chart {
		width: 100%;
		position: relative;
		flex: 1;
		min-height: 150px;
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
		margin: 0;
		font-weight: 600;
		color: #333;
		line-height: 1.2;
		word-wrap: break-word;
		overflow-wrap: break-word;
		width: 100%;
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
		flex-direction: column;
		border-radius: 0.5em;
		border: 1px solid var(--brandGrey);
		padding: 0.5em;
	}

	@media only screen and (min-width: 768px) {
		.legend-container {
			flex-direction: row;
		}
	}
</style>
