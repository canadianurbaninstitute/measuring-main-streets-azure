<script lang="ts">
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';
	const frMonthYear = new Intl.DateTimeFormat('fr-CA', { month: 'short', year: 'numeric' });

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/housingData.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});

	const seriesConfig = [
		{ key: 'Toronto', label: 'Toronto', color: '#f59e0b' },
		{ key: 'Calgary', label: 'Calgary', color: '#00adf2' },
		{ key: 'Vancouver', label: 'Vancouver', color: '#10b981' },
		{ key: 'Edmonton', label: 'Edmonton', color: '#58e965' },
		{ key: 'Halifax', label: 'Halifax', color: '#f1c500' },
		{ key: 'Ottawa', label: 'Ottawa', color: '#ff007f' },
		{ key: 'Montreal', label: 'Montréal', color: '#7c3aed' }
	];
</script>

<MultiLineChart
	{data}
	{visible}
	title={fr
		? 'Abordabilité du logement dans les plus grandes RMR'
		: 'Housing affordability in the largest CMAs'}
	{seriesConfig}
	stacked={true}
	showArea={true}
	showLines={false}
	showTotalLine={true}
	totalLineLabel="Total"
	totalLineColor="#002940"
	xTickInterval={20}
	yDomain={[-30, 15]}
	minHeight="300px"
	yLabel={fr
		? 'Indice d’abordabilité de l’accession à la propriété'
		: 'Homeownership Affordability Index score'}
	formatLabelX={fr ? (d: Date) => frMonthYear.format(d) : undefined}
	formatLabelY={fr ? (d: number) => formatNumber(d, undefined, lang) : (d: number) => String(d)}
	formatValue={fr
		? (d: number) =>
				formatNumber(d, { minimumFractionDigits: 2, maximumFractionDigits: 2 }, lang)
		: (d: number) => d.toFixed(2)}
/>
