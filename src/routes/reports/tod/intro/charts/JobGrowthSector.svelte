<script lang="ts">
	import { format } from 'd3-format';
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';

	interface SeriesConfigItem {
		key: string;
		label: string;
		color: string;
	}

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/03_jobsectorgrowth.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});

	const seriesConfig: SeriesConfigItem[] = [
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
	];
</script>

{#if data && data.length > 0}
	<MultiLineChart
		{data}
		{visible}
		minHeight="300px"
		xTickInterval={90}
		title="Job Growth by Sector, 1976-2025"
		yDomain={[0, 18000]}
		yLabel="Jobs"
		{seriesConfig}
		formatLabelY={(d: number) => format('~s')(d)}
		formatValue={(d: number) => format(',')(d)}
	/>
{/if}
