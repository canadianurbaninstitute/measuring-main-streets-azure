<script lang="ts">
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';

	let { visible } = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/urbanPopData.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});
</script>

{#if data.length > 0}
	<MultiLineChart
		{data}
		{visible}
		title="Urban Population Growth, 2001-2025"
		showTooltipTotal={false}
		yDomain={[-5, 60]}
		minHeight="400px"
		seriesConfig={[
			{
				key: 'Higher order transit regions',
				label: 'Higher order transit regions',
				color: '#002940'
			},
			{
				key: 'All other urban regions >100,000 pop.',
				label: 'All other urban regions >100,000 pop.',
				color: '#DB3069'
			},
			{
				key: 'Urban regions 10,000 to 100,000 pop.',
				label: 'Urban regions 10,000 to 100,000 pop.',
				color: '#43b171'
			},
			{
				key: 'Non-urban',
				label: 'Non-urban',
				color: '#f45d01'
			}
		]}
	/>
{/if}
