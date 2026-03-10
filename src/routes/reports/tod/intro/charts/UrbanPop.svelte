<script>
	import { BarChart } from '@onsvisual/svelte-charts';

	const urbanPop = [
		{
			region: 'Greater Golden Horseshoe',
			value: 24.3
		},
		{
			region: 'Montreal',
			value: 11
		},
		{
			region: 'BC Lower Mainland',
			value: 8
		},
		{
			region: 'Calgary',
			value: 4.4
		},
		{
			region: 'Edmonton',
			value: 4.1
		},
		{
			region: 'Ottawa-Gatineau',
			value: 4.1
		},
		{
			region: 'Non-urban',
			value: 15.3
		},
		{
			region: 'Urban regions 10,000 to 100,000',
			value: 9.9
		},
		{
			region: 'All other urban regions >100,000',
			value: 19
		}
	];
</script>

<BarChart
	data={urbanPop}
	xKey="value"
	yKey="region"
	title=" Six ‘transit regions’ share of Canadian population"
/>
