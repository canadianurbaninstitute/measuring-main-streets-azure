<script>
	import GroupedBarChart from '../../../../lib/ui/charts/GroupedBarChart.svelte';

	let { visible } = $props();

	const data = [
		{ period: '2001-2006', line5: 880, line6: 1675 },
		{ period: '2006-2011', line5: 8672, line6: 5570 },
		{ period: '2011-2016', line5: 2604, line6: -642 },
		{ period: '2016-2021', line5: 9361, line6: 608 },
		{ period: 'Active building ermits', line5: 40496, line6: 9484 },
		{ period: 'Development applications under review', line5: 83530, line6: 6012 }
	];

	const seriesConfig = [
		{ key: 'line5', label: 'Eglinton Crosstown (Line 5)', color: '#f45d01' },
		{ key: 'line6', label: 'Finch LRT (Line 6)', color: '#00adf2' }
	];
</script>

<GroupedBarChart
	{data}
	{seriesConfig}
	yKey="period"
	title="Building & Development by Transit Line"
	minHeight="300px"
	{visible}
	xTicks={6}
	xLabel="Units"
	wrapLabels={true}
	formatLabelX={(d) => d}
	padding={{ top: 10, right: 30, bottom: 20, left: 100 }}
/>
