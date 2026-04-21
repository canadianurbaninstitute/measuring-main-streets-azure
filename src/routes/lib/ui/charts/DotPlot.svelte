<script>
	export let data = [];
	export let yKey = '';
	export let xKey = []; // Array of string keys corresponding to values
	export let xDomain = [0, null];
	export let zDomain = null;
	export let zRange = null;
	export let seriesColors = ['#00adf2', '#db3069', '#43b171', '#f1c500', '#8a4285', '#f45d01'];
	export let height = '100%';
	export let padding = { top: 10, right: 10, bottom: 40, left: 100 };
	export let showLegend = false;
	export let legendLabels = null; // optional friendly labels array matching xKey
	export let xAxisLabel = '';
	export let showTooltip = true;
	export let tooltipFormatter = undefined; // function that takes `found` and returns HTML string

	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import DotPlotInner from '../chartcomponents/DotPlotInner.svg.svelte';
	import AxisX from '../chartcomponents/AxisX.svelte';
	import AxisY from '../chartcomponents/AxisY.svelte';
	import QuadTree from '../chartcomponents/QuadTree.html.svelte';

	$: resolvedZDomain = zDomain ?? xKey;
	$: resolvedZRange = zRange ?? seriesColors;
</script>

<div class="chart-wrapper flex flex-col h-full w-full">
	{#if showLegend}
		<div class="flex flex-wrap gap-4 mb-2 justify-end text-sm">
			{#each resolvedZDomain as domainItem, i}
				<div class="flex items-center gap-1.5">
					<span
						class="w-3 h-3 rounded-full"
						style="background-color: {resolvedZRange[i % resolvedZRange.length]}"
					></span>
					<span class="text-zinc-600 font-medium">
						{legendLabels ? legendLabels[i] : domainItem}
					</span>
				</div>
			{/each}
		</div>
	{/if}

	<div class="chart-container flex-1 min-h-0 relative" style={showLegend ? '' : `height: ${height}`}>
		<LayerCake
			{padding}
			x={xKey}
			y={yKey}
			yScale={scaleBand().paddingInner(0.05).round(true)}
			yDomainSort={false}
			{xDomain}
			xPadding={[10, 0]}
			zScale={scaleOrdinal()}
			zDomain={resolvedZDomain}
			zRange={resolvedZRange}
			{data}
		>
			<Svg>
				<AxisX ticks={4} label={xAxisLabel} />
				<AxisY gridlines={false} />
				<DotPlotInner />
			</Svg>

			{#if showTooltip}
				<Html>
					<QuadTree x="y" y="y" let:visible let:found let:e>
						{#if visible && found}
							<div
								class="absolute pointer-events-none bg-white/95 border border-zinc-200 shadow shadow-sky-900/10 p-2.5 rounded-lg text-sm z-50 transform -translate-y-full -translate-x-1/2 -mt-2 min-w-[150px]"
								style="top: {e?.layerY}px; left: {e?.layerX}px;"
							>
								{#if tooltipFormatter}
									{@html tooltipFormatter(found)}
								{:else}
									<div class="font-bold border-b border-zinc-200 pb-1.5 mb-1.5 text-zinc-900">{found[yKey]}</div>
									<div class="flex flex-col gap-1">
										{#each xKey as key, i}
											<div class="flex justify-between items-center gap-4">
												<div class="flex items-center gap-1.5">
													<span
														class="w-2.5 h-2.5 rounded-full"
														style="background-color: {resolvedZRange[i % resolvedZRange.length]}"
													></span>
													<span class="text-zinc-500 text-xs">{legendLabels ? legendLabels[i] : key}</span>
												</div>
												<span class="font-medium text-zinc-800">{found[key]}</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					</QuadTree>
				</Html>
			{/if}
		</LayerCake>
	</div>
</div>
