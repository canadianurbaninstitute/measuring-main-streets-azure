<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ activity: 'Work or school', car: 60.1, bus: 22.9, bike: 3.7, walk: 12.8 },
		{ activity: 'Favourite activity', car: 51.3, bus: 9.6, bike: 12.2, walk: 27.0 },
		{ activity: 'Grocery Store', car: 70.6, bus: 8.3, bike: 1.0, walk: 20.2 }
	];

	const seriesConfig = [
		{ key: 'car', label: 'Car', color: '#db3069' },
		{ key: 'bus', label: 'Bus', color: '#00adf2' },
		{ key: 'bike', label: 'Bike', color: '#58e965' },
		{ key: 'walk', label: 'Walk', color: '#f45d01' }
	];
</script>

<StackedBar
	{data}
	{seriesConfig}
	yKey="activity"
	minHeight="300px"
	{visible}
	xTicks={6}
	xLabel="Percent"
	wrapLabels={true}
	showTooltip={true}
	formatLabelX={(d) => `${d}%`}
	padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
/>
