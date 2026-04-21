<script>
	import { onMount } from 'svelte';
	import { TIER_1_AMENITIES } from '../../../../lib/data/transitdata/complete-communities-config';
	import DotPlot from '../../../../lib/ui/charts/DotPlot.svelte';

	let { visible } = $props();
	let data = $state([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/future_employees_needed_example_amenities.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const processedData = $derived(
		data
			.map((d) => ({
				amenity: d.Amenity,
				low: d.Emp_Low,
				high: d.Emp_High,
				color: TIER_1_AMENITIES.find((a) => a.label === d.Amenity)?.color || '#94a3b8'
			}))
			.sort((a, b) => b.high - a.high)
	);
</script>

{#if processedData.length > 0}
	<DotPlot
		data={processedData}
		yKey="amenity"
		xKey={['low', 'high']}
		zRange={['#00adf2', '#db3069']}
		padding={{ top: 10, right: 20, bottom: 20, left: 160 }}
		showLegend={true}
		legendLabels={['Low Employee Estimate', 'High Employee Estimate']}
	/>
{/if}

<style>
</style>
