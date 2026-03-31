<script>
	export let data = [];
	export let yKey = '';
	export let xDomain = [0, null];
	export let seriesColors = ['#00adf2', '#db3069', '#43b171', '#f1c500', '#8a4285', '#f45d01'];
	export let height = '100%';
	export let zDomain = null;
	export let zRange = null;

	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import ClevelandDotPlot from './DotPlotInner.svg.svelte';
	import AxisX from '../../../../lib/ui/chartcomponents/AxisX.svelte';
	import AxisY from '../../../../lib/ui/chartcomponents/AxisY.svelte';

	const xKey = Object.keys(data[0]).filter((d) => d !== yKey);

	$: resolvedZDomain = zDomain ?? xKey;
	$: resolvedZRange = zRange ?? seriesColors;
</script>

<div class="chart-container" style="height: {height}">
	<LayerCake
		padding={{ right: 10, bottom: 20, left: 30 }}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner(0.05).round(true)}
		yDomainSort={true}
		{xDomain}
		xPadding={[10, 0]}
		zScale={scaleOrdinal()}
		zDomain={resolvedZDomain}
		zRange={resolvedZRange}
		{data}
	>
		<Svg>
			<AxisX ticks={4} />
			<AxisY gridlines={false} />
			<ClevelandDotPlot />
		</Svg>
	</LayerCake>
</div>
