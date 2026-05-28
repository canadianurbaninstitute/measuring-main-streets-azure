<script lang="ts">
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { LayerCake, Svg } from 'layercake';

	import AxisX from '../../../../lib/ui/chartcomponents/AxisX.svelte';
	import AxisY from '../../../../lib/ui/chartcomponents/AxisY.svelte';
	import ClevelandDotPlot from './DotPlotInner.svg.svelte';

	// 1. Define strict TypeScript Props
	interface Props {
		data?: Record<string, any>[];
		yKey?: string;
		xDomain?: [number, number | null];
		seriesColors?: string[];
		height?: string;
		zDomain?: string[] | null;
		zRange?: string[] | null;
	}

	// 2. Destructure props with Svelte 5 $props() rune
	let {
		data = [],
		yKey = '',
		xDomain = [0, null],
		seriesColors = ['#00adf2', '#db3069', '#43b171', '#f1c500', '#8a4285', '#f45d01'],
		height = '100%',
		zDomain = null,
		zRange = null
	}: Props = $props();

	// 3. Turn into $derived states to safely compute keys reactively when data arrives
	let xKey = $derived(data.length > 0 ? Object.keys(data[0]).filter((d) => d !== yKey) : []);

	let resolvedZDomain = $derived(zDomain ?? xKey);
	let resolvedZRange = $derived(zRange ?? seriesColors);
</script>

<div class="chart-container" style="height: {height}">
	<LayerCake
		padding={{ right: 10, bottom: 20, left: 50 }}
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
			<AxisY gridlines={false} wrap={true} />
			<ClevelandDotPlot />
		</Svg>
	</LayerCake>
</div>
