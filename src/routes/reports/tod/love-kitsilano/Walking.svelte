<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ activity: 'Work or school', car: 33.8, bus: 25.9, bike: 14.5, walk: 25.9 },
		{ activity: 'Favourite activity', car: 26.3, bus: 13.9, bike: 16.7, walk: 43 },
		{ activity: 'Grocery Store', car: 26.8, bus: 4.8, bike: 4.5, walk: 63.9 }
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
