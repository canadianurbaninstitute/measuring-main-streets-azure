<script lang="ts">
	import { format as d3Format } from 'd3-format';
	import { scaleBand } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import Bar from '../chartcomponents/Bar.svelte';
	import ChartTooltip from '../chartcomponents/ChartTooltip.html.svelte';
	import QuadTree from '../chartcomponents/QuadTree.html.svelte';
	import LegendItem from '../legends/LegendItem.svelte';

	interface GroupConfigItem {
		value: string;
		label: string;
		color: string;
	}

	interface Props {
		data?: Record<string, any>[];
		xKey: string;
		yKey?: string;
		groupKey?: string;
		title?: string;
		titleFontSize?: string;
		xDomain?: [number | null, number | null];
		minHeight?: string;
		height?: string;
		paddingLeft?: number;
		paddingRight?: number;
		paddingTop?: number;
		paddingBottom?: number;
		barColor?: string;
		wrapLabels?: boolean;
		showTooltip?: boolean;
		formatTooltipValue?: (d: any) => any;
		visible?: boolean | undefined;
		xLabel?: string;
		yLabel?: string;
		xTicks?: any[] | number | undefined;
		yTicks?: any[] | number | undefined;
		formatLabelX?: (d: any) => any;
		formatLabelY?: (d: any) => any;
		showLegend?: boolean;
		highlightValue?: string;
		highlightColor?: string;
		barPadding?: number | undefined;
		groupConfig?: GroupConfigItem[];
	}

	let {
		data = [],
		xKey,
		yKey = 'name',
		groupKey = 'ms_type',
		title = '',
		titleFontSize = '1.1rem',
		xDomain = [0, null],
		minHeight = '150px',
		height = '250px',
		paddingLeft = 160,
		paddingRight = 20,
		paddingTop = 10,
		paddingBottom = 25,
		barColor = '#00adf2',
		wrapLabels = false,
		showTooltip = false,
		formatTooltipValue = (d: any) => d3Format(',')(d),
		visible = undefined,
		xLabel = '',
		yLabel = '',
		xTicks = undefined,
		yTicks = undefined,
		formatLabelX = (d: any) => d,
		formatLabelY = (d: any) => d,
		showLegend = true,
		highlightValue = '',
		highlightColor = '#f45d01',
		barPadding = undefined,
		groupConfig = []
	}: Props = $props();

	let innerWidth = $state(1000);
	let innerHeight = $state(800);

	const computedPaddingLeft = $derived(
		innerWidth < 768 ? Math.max(60, Math.min(paddingLeft, 80)) : paddingLeft
	);
	const computedHeight = $derived(innerWidth < 768 ? '100%' : height);
	const computedWrapLabels = $derived(innerWidth < 768 ? true : wrapLabels);
	const computedShowLegend = $derived(innerHeight < 900 ? false : showLegend);
	const computedBarPadding = $derived(
		barPadding !== undefined ? barPadding : data.length > 3 ? 0.1 : 0.3
	);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="chart-container">
	{#if title}
		<h4 style:font-size={titleFontSize || 'inherit'}>{title}</h4>
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

	<div class="chart" style:min-height={minHeight} style:height={computedHeight}>
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
								tickMarks
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
							<QuadTree x="y" y="y" dataset={data}>
								{#snippet children({ found, visible: qVisible, e })}
									{#if qVisible && found && e}
										<ChartTooltip
											{found}
											{e}
											titleKey={yKey}
											valueKey={xKey}
											formatValue={formatTooltipValue}
										/>
									{/if}
								{/snippet}
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
					<AxisX
						tickMarks
						baseline
						snapLabels
						label={xLabel}
						ticks={xTicks}
						format={formatLabelX}
					/>
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
						<QuadTree x="y" y="y">
							{#snippet children({ found, visible: qVisible, e })}
								{#if qVisible && found && e}
									<ChartTooltip
										{found}
										{e}
										titleKey={yKey}
										valueKey={xKey}
										formatValue={formatTooltipValue}
									/>
								{/if}
							{/snippet}
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
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		color: var(--brandDarkBlue);
		letter-spacing: -0.01em;
		line-height: 120%;
		font-weight: 300;
		text-transform: uppercase;
		max-width: 80ch;
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
