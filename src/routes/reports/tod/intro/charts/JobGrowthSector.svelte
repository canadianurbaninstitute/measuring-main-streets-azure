<script lang="ts">
	import { format } from 'd3-format';
	import { onMount } from 'svelte';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';
	const frMonthYear = new Intl.DateTimeFormat('fr-CA', { month: 'short', year: 'numeric' });
	// d3 "~s" gives SI suffixes ("5k"); French uses "k" too, but needs a comma decimal separator.
	const frFormatSI = (d: number) => format('~s')(d).replace('.', ',');

	interface SeriesConfigItem {
		key: string;
		label: string;
		color: string;
	}

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/03_jobsectorgrowth.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});

	const seriesConfig: SeriesConfigItem[] = [
		{
			key: 'Services-producing sectors',
			label: fr ? 'Secteurs producteurs de services' : 'Services-producing sectors',
			color: '#002940'
		},
		{
			key: 'Goods-producing sectors',
			label: fr ? 'Secteurs producteurs de biens' : 'Goods-producing sectors',
			color: '#DB3069'
		}
	];
</script>

{#if data && data.length > 0}
	<MultiLineChart
		{data}
		{visible}
		minHeight="300px"
		xTickInterval={90}
		title={fr
			? 'Croissance de l’emploi par secteur, 1976-2025'
			: 'Job Growth by Sector, 1976-2025'}
		yDomain={[0, 18000]}
		yLabel={fr ? 'Emplois' : 'Jobs'}
		{seriesConfig}
		formatLabelX={fr ? (d: Date) => frMonthYear.format(d) : undefined}
		formatLabelY={fr ? frFormatSI : (d: number) => format('~s')(d)}
		formatValue={fr ? (d: number) => formatNumber(d, undefined, lang) : (d: number) => format(',')(d)}
	/>
{/if}
