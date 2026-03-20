<script>
	import PieChart from '../../../../lib/ui/charts/PieChart.svelte';

	const urbanPop = [
		{
			region: 'Greater Golden Horseshoe',
			value: 24.3,
			color: '#00adf2'
		},
		{
			region: 'Montreal',
			value: 11,
			color: '#58e965'
		},
		{
			region: 'BC Lower Mainland',
			value: 8,
			color: '#DB3069'
		},
		{
			region: 'Calgary',
			value: 4.4,
			color: '#002940'
		},
		{
			region: 'Edmonton',
			value: 4.1,
			color: '#ff007f'
		},
		{
			region: 'Ottawa-Gatineau',
			value: 4.1,
			color: '#f59e0b'
		},
		{
			region: 'Non-urban',
			value: 15.3,
			color: '#7c3aed'
		},
		{
			region: 'Urban regions 10,000 to 100,000',
			value: 9.9,
			color: '#10b981'
		},
		{
			region: 'All other urban regions >100,000',
			value: 19,
			color: '#f43f5e'
		}
	];
</script>

<PieChart
	data={urbanPop}
	xKey="region"
	yKey="value"
	title="Six ‘transit regions’ share of Canadian population"
	showTooltip={true}
/>
