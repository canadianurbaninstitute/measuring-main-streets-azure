<script>
	import BarChart from '../../../../lib/ui/charts/BarChart.svelte';

	let { visible } = $props();

	const data = [
		{ station: 'Mount Dennis', value: 6859 },
		{ station: 'Keelesdale', value: 5211 },
		{ station: 'Caledonia', value: 4806 },
		{ station: 'Fairbank', value: 5271 },
		{ station: 'Oakwood', value: 5170 },
		{ station: 'Eglinton West/Cedarvale', value: 921 },
		{ station: 'Forest Hill', value: 1024 },
		{ station: 'Chaplin', value: 1043 },
		{ station: 'Avenue', value: 3041 },
		{ station: 'Eglinton', value: 36901 },
		{ station: 'Mount Pleasant', value: 31716 },
		{ station: 'Leaside', value: 4412 },
		{ station: 'Laird', value: 5206 },
		{ station: 'Sunnybrook Park', value: 3419 },
		{ station: 'Don Valley', value: 17445 },
		{ station: 'Aga Khan Park & Museum', value: 22928 },
		{ station: 'Wynford', value: 10574 },
		{ station: 'Sloane', value: 1037 },
		{ station: "O'Connor", value: 20821 },
		{ station: 'Pharmacy', value: 24975 },
		{ station: 'Hakimi Lebovic', value: 27454 },
		{ station: 'Golden Mile', value: 24708 },
		{ station: 'Birchmount', value: 10348 },
		{ station: 'Ionview', value: 5335 },
		{ station: 'Kennedy', value: 2081 }
	];
</script>

<BarChart
	{data}
	xKey="value"
	yKey="station"
	title="Proposed & Under Construction Units by Line 5 Station"
	paddingLeft={160}
	barColor="#f45d01"
	showTooltip={true}
	formatTooltipValue={(d) => Math.round(d).toLocaleString()}
	{visible}
	xTicks={4}
	xLabel="Units"
	minHeight="400px"
/>
