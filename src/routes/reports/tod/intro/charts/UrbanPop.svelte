<script>
	import PieChart from '../../../../lib/ui/charts/PieChart.svelte';

	let { visible = $bindable() } = $props();

	$effect(() => {
		console.log(visible);
	});

	const urbanPop = [
		{
			label: 'Greater Golden Horseshoe',
			value: 24.3,
			color: '#58e965'
		},
		{
			label: 'Montreal',
			value: 11,
			color: '#a4f3ab'
		},
		{
			label: 'BC Lower Mainland',
			value: 8,
			color: '#86efac'
		},
		{
			label: 'Calgary',
			value: 4.4,
			color: '#34d09f'
		},
		{
			label: 'Edmonton',
			value: 4.1,
			color: '#2b8751'
		},
		{
			label: 'Ottawa-Gatineau',
			value: 4.1,
			color: '#226a40'
		},
		{
			label: 'Non-urban',
			value: 15.3,
			color: '#446273'
		},
		{
			label: 'Urban regions 10,000 to 100,000',
			value: 9.9,
			color: '#617a89'
		},
		{
			label: 'All other urban regions >100,000',
			value: 19,
			color: '#8ea1ab'
		}
	];
</script>

<PieChart
	data={urbanPop}
	{visible}
	xKey="label"
	yKey="value"
	title="Six ‘transit regions’ share of Canadian population"
	showTooltip={true}
	explode={[
		'Greater Golden Horseshoe',
		'Montreal',
		'BC Lower Mainland',
		'Calgary',
		'Edmonton',
		'Ottawa-Gatineau'
	]}
	seriesConfig={urbanPop}
/>
