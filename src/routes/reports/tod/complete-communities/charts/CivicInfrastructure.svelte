<script>
	import { onMount } from 'svelte';
	import GroupedBarChart from '../../../../lib/ui/charts/GroupedBarChart.svelte';

	let { visible } = $props();
	let data = $state([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/Library_CC_status_by_Population.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const processedData = $derived.by(() => {
		const statuses = ['Neither', 'One', 'Both'];
		return statuses.map((status) => {
			const rows = data.filter((d) => d.lib_cc_status === status);
			const row = { status };
			rows.forEach((r) => {
				row[r.region] = r.TSA_pop;
			});
			return row;
		});
	});

	const colors = ['#002940', '#2a5cac', '#43b171', '#f13737', '#f45d01', '#8a4285'];
	const regions = $derived([...new Set(data.map((d) => d.region))]);

	const seriesConfig = $derived(
		regions.map((region, i) => ({
			key: region,
			label: region,
			color: colors[i % colors.length]
		}))
	);
</script>

<GroupedBarChart
	data={processedData}
	{seriesConfig}
	yKey="status"
	minHeight="500px"
	{visible}
	xTicks={6}
	xLabel="Average Population"
	wrapLabels={true}
	formatLabelX={(d) => d.toFixed(0)}
	padding={{ top: 10, right: 30, bottom: 40, left: 40 }}
/>
