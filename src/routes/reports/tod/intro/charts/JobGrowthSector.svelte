<script>
	import MultiLineChart from '../../../mainstreets-malls-mice/MultiLineChart.svelte';
	import { format } from 'd3-format';

	export let data = [];
</script>

<MultiLineChart
	{data}
	title="Job Growth by Sector, 1976-2025"
	yDomain={[0, 18000]}
	seriesConfig={[
		{
			key: 'Services-producing sectors',
			label: 'Services-producing sectors',
			color: '#002940'
		},
		{
			key: 'Goods-producing sectors',
			label: 'Goods-producing sectors',
			color: '#DB3069'
		}
	]}
	formatLabelY={(d) => format('~s')(d)}
	formatValue={(d) => format(',')(d)}
/>
