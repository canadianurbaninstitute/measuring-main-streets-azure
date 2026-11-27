<script lang="ts">
	import PieChart from '../../../../lib/ui/charts/PieChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';

	let { visible = $bindable() } = $props();

	const urbanPopEn = [
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

	const LABELS_FR: Record<string, string> = {
		'Greater Golden Horseshoe': 'Région élargie du Golden Horseshoe',
		Montreal: 'Montréal',
		'BC Lower Mainland': 'Lower Mainland (C.-B.)',
		'Non-urban': 'Non urbain',
		'Urban regions 10,000 to 100,000': 'Régions urbaines de 10 000 à 100 000 hab.',
		'All other urban regions >100,000': 'Autres régions urbaines de plus de 100 000 hab.'
	};
	const tr = (label: string) => (fr ? (LABELS_FR[label] ?? label) : label);

	// French: translated labels and a readable value key (the tooltip shows the key name).
	const urbanPop = fr
		? urbanPopEn.map((d) => ({ label: tr(d.label), Part: d.value, color: d.color }))
		: urbanPopEn;

	const explode = [
		'Greater Golden Horseshoe',
		'Montreal',
		'BC Lower Mainland',
		'Calgary',
		'Edmonton',
		'Ottawa-Gatineau'
	].map(tr);
</script>

<PieChart
	data={urbanPop}
	{visible}
	xKey="label"
	yKey={fr ? 'Part' : 'value'}
	title={fr
		? 'Part de la population canadienne dans les six « régions de transport collectif »'
		: 'Six ‘transit regions’ share of Canadian population'}
	showTooltip={true}
	formatTooltipValue={fr
		? (d: any) =>
				isNaN(+d) || d === null
					? d
					: formatNumber(+d, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, lang) + ' %'
		: undefined}
	{explode}
/>
