<script>
	import MultiLineChart from '../../lib/ui/charts/MultiLineChart.svelte';
	import { format } from 'd3-format';

	let {
		data = [],
		title = '',
		yDomain = [0, null],
		seriesConfig = [],
		xKey = 'date',
		formatLabelY = (d) => format('~s')(d) + '%',
		formatValue = (d) => d.toFixed(0) + '%'
	} = $props();
</script>

<MultiLineChart
	{data}
	{title}
	{yDomain}
	{seriesConfig}
	{xKey}
	{formatLabelY}
	{formatValue}
/>
