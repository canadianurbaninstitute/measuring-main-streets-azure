<script>
	import BarChart from '../../lib/ui/charts/BarChart.svelte';

	import civic from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-civic.csv';
	import distance from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-distance.csv';
	import independence from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-independence.csv';

	export let xKey;
	export let title = '';
	export let xDomain = [0, null];

	$: data = xKey === 'civic' ? civic : xKey === 'independence' ? independence : distance;

	const groupConfig = [
		{ value: 'Downtown and CBD', label: 'Downtown Main Streets', color: '#58e965' },
		{ value: 'Small Town', label: 'Small Town Main Streets', color: '#00adf2' },
		{ value: 'Regional Mall', label: 'Malls', color: '#DB3069' },
		{
			value: 'Urban and Suburban Main Street',
			label: 'Neighbourhood Main Streets',
			color: '#002940'
		}
	];
</script>

<BarChart {...$$restProps} {data} {xKey} {title} {xDomain} {groupConfig} height="800px" />
