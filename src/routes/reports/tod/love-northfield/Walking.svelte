<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';

	let { visible } = $props();

	const fr = getLang() === 'fr';

	const data = [
		{ activity: 'Work or school', car: 60.1, bus: 22.9, bike: 3.7, walk: 12.8 },
		{ activity: 'Favourite activity', car: 51.3, bus: 9.6, bike: 12.2, walk: 27.0 },
		{ activity: 'Grocery Store', car: 70.6, bus: 8.3, bike: 1.0, walk: 20.2 }
	];

	const seriesConfig = [
		{ key: 'car', label: fr ? 'Automobile' : 'Car', color: '#db3069' },
		{ key: 'bus', label: fr ? 'Autobus' : 'Bus', color: '#00adf2' },
		{ key: 'bike', label: fr ? 'Vélo' : 'Bike', color: '#58e965' },
		{ key: 'walk', label: fr ? 'Marche' : 'Walk', color: '#f45d01' }
	];

	const labelsFr = {
		'Work or school': 'Travail ou école',
		'Favourite activity': 'Activité préférée',
		'Grocery Store': 'Épicerie'
	};
	const rows = fr
		? data.map((d) => ({ ...d, activity: labelsFr[d.activity] ?? d.activity }))
		: data;

	// Axis ticks and tooltip values (French: 45 %, 12,5 %)
	const formatPercent = (d) => (fr ? `${formatNumber(d, undefined, 'fr')}\u00a0%` : `${d}%`);
	const formatTooltipValue = fr
		? (d) =>
				isNaN(+d) || d === null
					? d
					: `${formatNumber(+d, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, 'fr')}\u00a0%`
		: undefined;
</script>

<StackedBar
	data={rows}
	{seriesConfig}
	yKey="activity"
	minHeight="300px"
	{visible}
	xTicks={6}
	xLabel={fr ? 'Pourcentage' : 'Percent'}
	wrapLabels={true}
	showTooltip={true}
	formatLabelX={formatPercent}
	{formatTooltipValue}
	padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
/>
