<script>
	import { format } from 'd3-format';
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';

	let { visible } = $props();
	let data = $state();

	onMount(async () => {
		// load data
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/03_jobsectorgrowth.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});
</script>

{#if data}
	<MultiLineChart
		{data}
		{visible}
		minHeight="300px"
		xTickInterval={90}
		title="Job Growth by Sector, 1976-2025"
		yDomain={[0, 18000]}
		yLabel="Jobs"
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
{/if}
