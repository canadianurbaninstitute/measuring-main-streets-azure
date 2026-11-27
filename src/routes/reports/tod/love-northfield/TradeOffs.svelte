<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';

	let { visible } = $props();

	const fr = getLang() === 'fr';

	const data = [
		{ activity: 'Leisure', densification: 50.6, individuality: 49.4 },
		{ activity: 'Accessibility', densification: 62.2, individuality: 37.8 },
		{ activity: 'Neighbours', densification: 52.3, individuality: 47.7 },
		{ activity: 'Home size', densification: 58.6, individuality: 41.4 },
		{ activity: 'Shopping', densification: 69.3, individuality: 30.7 },
		{ activity: 'Road usage', densification: 83.7, individuality: 16.3 },
		{ activity: 'Road space', densification: 63.5, individuality: 36.5 }
	];

	const seriesConfig = [
		{
			key: 'densification',
			label: fr ? 'Favorise la densification' : 'Favours Densification',
			color: '#00adf2'
		},
		{
			key: 'individuality',
			label: fr ? 'Favorise l’individualité' : 'Favours Individuality',
			color: '#f45d01'
		}
	];

	const labelsFr = {
		'Leisure': 'Loisirs',
		'Accessibility': 'Accessibilité',
		'Neighbours': 'Voisinage',
		'Home size': 'Taille du logement',
		'Shopping': 'Magasinage',
		'Road usage': 'Utilisation des routes',
		'Road space': 'Espace routier'
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
