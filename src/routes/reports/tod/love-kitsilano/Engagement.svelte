<script>
	import GroupedBarChart from '../../../lib/ui/charts/GroupedBarChart.svelte';

	let { visible } = $props();

	const data = [
		{ metric: 'Total questions answered', cooksville: 1499, northfield: 1321, kitsilano: 3283 },
		{
			metric: 'Respondents who answered 1+ question',
			cooksville: 144,
			northfield: 119,
			kitsilano: 310
		},
		{ metric: 'Links clicked', cooksville: 75, northfield: 64, kitsilano: 90 },
		{ metric: 'Postal codes shared', cooksville: 86, northfield: 70, kitsilano: 197 },
		{ metric: 'Community poll statements', cooksville: 66, northfield: 37, kitsilano: 98 },
		{ metric: 'Community poll votes', cooksville: 1651, northfield: 1126, kitsilano: 3414 }
	];

	const seriesConfig = [
		{ key: 'cooksville', label: 'Cooksville', color: '#00adf2' },
		{ key: 'northfield', label: 'Northfield', color: '#00adf2' },
		{ key: 'kitsilano', label: 'Kitsilano', color: '#f45d01' }
	];
</script>

<div class="grid grid-cols-2 grid-rows-3 w-full h-full">
	{#each data as item}
		<GroupedBarChart
			data={[item]}
			{seriesConfig}
			yKey="metric"
			minHeight="100px"
			{visible}
			xTicks={3}
			showLegend={false}
			wrapLabels={true}
			formatLabelX={(d) => d}
			padding={{ top: 30, right: 0, bottom: 30, left: 70 }}
		/>
	{/each}
</div>
