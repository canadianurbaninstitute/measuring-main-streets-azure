<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';

	let { visible } = $props();

	const fr = getLang() === 'fr';

	const data = [
		{ activity: 'Leisure', densification: 47.8, individuality: 52.3 },
		{ activity: 'Accessibility', densification: 45, individuality: 55 },
		{ activity: 'Neighbours', densification: 31.5, individuality: 68.5 },
		{ activity: 'Home size', densification: 76.4, individuality: 23.6 },
		{ activity: 'Shopping', densification: 83.3, individuality: 16.7 },
		{ activity: 'Road usage', densification: 83.2, individuality: 16.8 },
		{ activity: 'Road space', densification: 63.2, individuality: 36.8 }
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
