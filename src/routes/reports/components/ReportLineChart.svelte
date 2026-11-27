<script>
	import MultiLineChart from '../../lib/ui/charts/MultiLineChart.svelte';
	import { format } from 'd3-format';
	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';

	let {
		data = [],
		title = '',
		yDomain = [0, null],
		seriesConfig = [],
		xKey = 'date',
		formatLabelY = (d) =>
			fr ? format('~s')(d).replace('.', ',') + '\u00a0%' : format('~s')(d) + '%',
		formatValue = (d) => (fr ? d.toFixed(0) + '\u00a0%' : d.toFixed(0) + '%')
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
