<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from 'd3-format';
	import MultiLineChart from '../../../../lib/ui/charts/MultiLineChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';
	const frMonthYear = new Intl.DateTimeFormat('fr-CA', { month: 'short', year: 'numeric' });

	let { visible } = $props();
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/urbanPopData.json'
			);
			data = await response.json();
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});
</script>

{#if data.length > 0}
	<MultiLineChart
		{data}
		{visible}
		title={fr
			? 'Croissance de la population urbaine, 2001-2025'
			: 'Urban Population Growth, 2001-2025'}
		showTooltipTotal={false}
		formatLabelX={fr ? (d: Date) => frMonthYear.format(d) : undefined}
		formatLabelY={fr ? (d: number) => format('~s')(d).replace('.', ',') + ' %' : undefined}
		formatValue={fr
			? (d: number) => formatNumber(d, { maximumFractionDigits: 0 }, lang) + ' %'
			: undefined}
		yDomain={[-5, 60]}
		minHeight="400px"
		seriesConfig={[
			{
				key: 'Higher order transit regions',
				label: fr
					? 'Régions dotées de transport collectif structurant'
					: 'Higher order transit regions',
				color: '#002940'
			},
			{
				key: 'All other urban regions >100,000 pop.',
				label: fr
					? 'Autres régions urbaines de plus de 100 000 hab.'
					: 'All other urban regions >100,000 pop.',
				color: '#DB3069'
			},
			{
				key: 'Urban regions 10,000 to 100,000 pop.',
				label: fr
					? 'Régions urbaines de 10 000 à 100 000 hab.'
					: 'Urban regions 10,000 to 100,000 pop.',
				color: '#43b171'
			},
			{
				key: 'Non-urban',
				label: fr ? 'Non urbain' : 'Non-urban',
				color: '#f45d01'
			}
		]}
	/>
{/if}
