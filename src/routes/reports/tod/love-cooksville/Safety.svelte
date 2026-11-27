<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';

	let { visible } = $props();

	const fr = getLang() === 'fr';

	const data = [
		{ region: 'Cooksville', safe: 62.6, sometimes: 27.3, unsafe: 10.1 },
		{ region: 'Northfield', safe: 87.7, sometimes: 9.9, unsafe: 2.5 },
		{ region: 'Kitsilano', safe: 90.8, sometimes: 5.5, unsafe: 3.7 }
	];

	const dataWelcome = [
		{ region: 'Cooksville', welcome: 68.5, sometimes: 22.8, unwelcome: 6.5 },
		{ region: 'Northfield', welcome: 81.0, sometimes: 12.7, unwelcome: 5.1 },
		{ region: 'Kitsilano', welcome: 88.8, sometimes: 8.1, unwelcome: 1.7 }
	];

	const seriesConfig = [
		{
			key: 'safe',
			label: fr ? 'Se sent généralement en sécurité' : 'Generally feels safe',
			color: '#58e965'
		},
		{
			key: 'sometimes',
			label: fr ? 'Se sent parfois en sécurité' : 'Sometimes feels safe',
			color: '#00adf2'
		},
		{
			key: 'unsafe',
			label: fr ? 'Se sent généralement en insécurité' : 'Generally feels unsafe',
			color: '#db3069'
		}
	];

	const seriesConfigWelcome = [
		{
			key: 'welcome',
			label: fr ? 'Sentiment d’accueil généralement présent' : 'Generally feels welcome',
			color: '#58e965'
		},
		{
			key: 'sometimes',
			label: fr ? 'Sentiment d’accueil parfois présent' : 'Sometimes feels welcome',
			color: '#00adf2'
		},
		{
			key: 'unwelcome',
			label: fr ? 'Sentiment d’accueil généralement absent' : 'Generally feels unwelcome',
			color: '#db3069'
		}
	];

	// Axis ticks and tooltip values (French: 45 %, 12,5 %)
	const formatPercent = (d) => (fr ? `${formatNumber(d, undefined, 'fr')}\u00a0%` : `${d}%`);
	const formatTooltipValue = fr
		? (d) =>
				isNaN(+d) || d === null
					? d
					: `${formatNumber(+d, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, 'fr')}\u00a0%`
		: undefined;
</script>

<div class="grid grid-cols-1 grid-rows-2 w-full h-full gap-1 p-0">
	<StackedBar
		title={fr ? 'Sentiment de sécurité' : 'Feels safe'}
		{data}
		{seriesConfig}
		yKey="region"
		minHeight="200px"
		{visible}
		xTicks={6}
		wrapLabels={true}
		showTooltip={true}
		formatLabelX={formatPercent}
		{formatTooltipValue}
		padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
		showLegend={false}
		xLabel={fr ? 'Pourcentage' : 'Percent'}
	/>

	<StackedBar
		title={fr ? 'Sentiment d’accueil' : 'Feels welcome'}
		data={dataWelcome}
		seriesConfig={seriesConfigWelcome}
		yKey="region"
		minHeight="200px"
		{visible}
		xTicks={6}
		wrapLabels={true}
		showTooltip={true}
		formatLabelX={formatPercent}
		{formatTooltipValue}
		padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
		showLegend={false}
		xLabel={fr ? 'Pourcentage' : 'Percent'}
	/>
</div>
