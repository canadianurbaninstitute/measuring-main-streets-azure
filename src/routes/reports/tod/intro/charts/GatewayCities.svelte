<script lang="ts">
	import PieChart from '../../../../lib/ui/charts/PieChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';

	let { visible } = $props();

	const topLevelEn = [
		{ label: 'Transit Regions', value: 77.6, color: '#00adf2', drilldown: true },
		{ label: 'Other Census Metropolitan Areas', value: 15.0, color: '#7c3aed' },
		{ label: 'Census Agglomerations', value: 4.3, color: '#10b981' },
		{ label: 'Non-urban', value: 3.2, color: '#f43f5e' }
	];

	const transitRegionsEn = [
		{ label: 'Greater Golden Horseshoe', value: 37.9, color: '#00adf2' },
		{ label: 'Montreal', value: 13.6, color: '#58e965' },
		{ label: 'BC Lower Mainland', value: 12.7, color: '#DB3069' },
		{ label: 'Calgary', value: 5.8, color: '#002940' },
		{ label: 'Edmonton', value: 4.1, color: '#ff007f' },
		{ label: 'Ottawa', value: 3.5, color: '#f59e0b' }
	];

	const LABELS_FR: Record<string, string> = {
		'Transit Regions': 'Régions de transport collectif',
		'Other Census Metropolitan Areas': 'Autres régions métropolitaines de recensement',
		'Census Agglomerations': 'Agglomérations de recensement',
		'Non-urban': 'Non urbain',
		'Greater Golden Horseshoe': 'Région élargie du Golden Horseshoe',
		Montreal: 'Montréal',
		'BC Lower Mainland': 'Lower Mainland (C.-B.)'
	};
	const tr = (label: string) => (fr ? (LABELS_FR[label] ?? label) : label);
	// French: translated labels and a readable value key (the tooltip shows the key name).
	const localize = (rows: { label: string; value: number; [k: string]: any }[]) =>
		fr ? rows.map(({ value, ...d }) => ({ ...d, label: tr(d.label), Part: value })) : rows;

	const topLevel = localize(topLevelEn);
	const transitRegions = localize(transitRegionsEn);
	const transitRegionsKey = tr('Transit Regions');
</script>

<PieChart
	data={topLevel}
	drilldownData={{
		[transitRegionsKey]: transitRegions
	}}
	{visible}
	xKey="label"
	yKey={fr ? 'Part' : 'value'}
	title={fr ? 'Part de l’immigration selon la géographie' : 'Share of immigration by geography'}
	showTooltip={true}
	formatTooltipValue={fr
		? (d: any) =>
				isNaN(+d) || d === null
					? d
					: formatNumber(+d, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, lang) + ' %'
		: undefined}
	explode={[transitRegionsKey]}
/>
