<script>
	import BarChart from '../../lib/ui/charts/BarChart.svelte';
	import { getLang } from '../../lib/i18n';
	import { frNumber } from './frFormat.js';

	import civic from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-civic.csv';
	import distance from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-distance.csv';
	import independence from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-independence.csv';
	import { selectLabelsFr } from '../../lib/data/reportdata/mainstreets-malls-mice/selectLabels.js';

	const fr = getLang() === 'fr';

	export let xKey;
	export let title = '';
	export let xDomain = [0, null];

	$: rawData = xKey === 'civic' ? civic : xKey === 'independence' ? independence : distance;
	// Montreal-region names are shown in French on French pages (display only).
	$: data = fr ? rawData.map((d) => ({ ...d, name: selectLabelsFr[d.name] ?? d.name })) : rawData;

	const groupConfig = [
		{
			value: 'Downtown and CBD',
			label: fr ? 'Rues principales de centre-ville' : 'Downtown Main Streets',
			color: '#58e965'
		},
		{
			value: 'Small Town',
			label: fr ? 'Rues principales de petites villes' : 'Small Town Main Streets',
			color: '#00adf2'
		},
		{ value: 'Regional Mall', label: fr ? 'Centres commerciaux' : 'Malls', color: '#DB3069' },
		{
			value: 'Urban and Suburban Main Street',
			label: fr ? 'Rues principales de quartier' : 'Neighbourhood Main Streets',
			color: '#002940'
		}
	];

	// French number formatting for the axis (0.2 -> 0,2); English keeps the chart default.
	$: frProps = fr ? { formatLabelX: frNumber } : {};
</script>

<BarChart
	{...$$restProps}
	{...frProps}
	{data}
	{xKey}
	{title}
	{xDomain}
	{groupConfig}
	minHeight="800px"
/>
