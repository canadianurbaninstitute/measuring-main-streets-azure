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
	export let xDomain = [0, null];
	export let height = '800px';
	export let paddingLeft = 160;
	export let paddingTop = 10;
	export let barColor = '#00adf2';
	export let wrapLabels = false;
	export let showTooltip = false;
	export let formatTooltipValue = (d) => d3Format(',.1f')(d) + '%';
	export let visible = false;
	export let xLabel = '';
	export let yLabel = '';
	export let xTicks = undefined;
	export let yTicks = undefined;

	/**
	 * Configuration for groups, including their data value, legend label, and bar color.
	 */
	export let groupConfig = [];
</script>

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	{#if groupConfig && groupConfig.length > 0}
		<div class="controls">
			<div class="legend-container">
				{#each groupConfig as { label, color }}
					<LegendItem variant={'polygon'} {label} bgcolor={color} />
				{/each}
			</div>
		</div>
	{/if}

	<div class="chart" style:height>
		{#if groupConfig && groupConfig.length > 0}
			{#each groupConfig as { value, color }, i}
				<LayerCake
					position="absolute"
					padding={{ top: paddingTop, bottom: 20, left: paddingLeft }}
					x={xKey}
					y={yKey}
					yDomainSort={false}
					yScale={scaleBand().paddingInner(0.1)}
					{xDomain}
					data={data.filter((d) => d[groupKey] === value)}
					flatData={data}
				>
					<Svg>
						{#if i === 0}
							<AxisX tickMarks baseline snapLabels label={xLabel} ticks={xTicks} />
							<AxisY tickMarks gridlines={false} wrap={wrapLabels} label={yLabel} ticks={yTicks} />
						{/if}
						<Bar fill={color} />
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
				padding={{ top: paddingTop, bottom: 20, left: paddingLeft }}
				x={xKey}
				y={yKey}
				yDomainSort={false}
				yScale={scaleBand().paddingInner(0.1)}
				{xDomain}
				{data}
			>
				<Svg>
					<AxisX tickMarks baseline snapLabels label={xLabel} ticks={xTicks} />
					<AxisY tickMarks gridlines={false} wrap={wrapLabels} label={yLabel} ticks={yTicks} />
					<Bar fill={barColor} />
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
