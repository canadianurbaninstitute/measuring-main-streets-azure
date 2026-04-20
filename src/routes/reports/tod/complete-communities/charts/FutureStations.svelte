<script>
	import BarChart from '../../../../lib/ui/charts/BarChart.svelte';

	let { visible, data = [] } = $props();

	const processedData = $derived(
		data
			.map((d) => ({
				region: d.region,
				needed: d.Total_Employees_Needed,
				stations: d.Future_Stations,
				perStation: d.Core_Employees_per_Station
			}))
			.sort((a, b) => b.needed - a.needed)
	);
</script>

<BarChart
	data={processedData}
	xKey="perStation"
	yKey="region"
	title="Core Service Jobs Needed per Future Station"
	xLabel="Average Service Jobs per Station Area"
	formatLabelX={(d) => d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
	showTooltip={true}
	{visible}
	minHeight="400px"
	height="500px"
	barColor="#f97316"
/>
