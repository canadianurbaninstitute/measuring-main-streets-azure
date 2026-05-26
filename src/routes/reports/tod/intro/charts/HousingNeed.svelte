<script lang="ts">
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/housingData.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});

	const seriesConfig = [
		{ key: 'Toronto', label: 'Toronto', color: '#f59e0b' },
		{ key: 'Calgary', label: 'Calgary', color: '#00adf2' },
		{ key: 'Vancouver', label: 'Vancouver', color: '#10b981' },
		{ key: 'Edmonton', label: 'Edmonton', color: '#58e965' },
		{ key: 'Halifax', label: 'Halifax', color: '#f1c500' },
		{ key: 'Ottawa', label: 'Ottawa', color: '#ff007f' },
		{ key: 'Montreal', label: 'Montréal', color: '#7c3aed' }
	];
</script>

<MultiLineChart
	{data}
	{visible}
	title="Housing affordability in the largest CMAs"
	{seriesConfig}
	stacked={true}
	showArea={true}
	showLines={false}
	showTotalLine={true}
	totalLineLabel="Total"
	totalLineColor="#002940"
	xTickInterval={20}
	yDomain={[-30, 15]}
	minHeight="300px"
	yLabel="Homeownership Affordability Index score"
	formatLabelY={(d: number) => String(d)}
	formatValue={(d: number) => d.toFixed(2)}
/>
