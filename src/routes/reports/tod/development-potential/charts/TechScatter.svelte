<script>
	import Icon from '@iconify/svelte';
	import { median } from 'd3-array';
	import { autoType, csvParse } from 'd3-dsv';
	import { onMount } from 'svelte';
	import ScatterChart from '../../../../lib/ui/charts/ScatterChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const lang = fr ? 'fr' : 'en';
	// Display-only translations; data values and option values stay in English (lookup keys).
	const GROUP_FR = {
		All: 'Toutes',
		'Greater Golden Horseshoe': 'Région élargie du Golden Horseshoe',
		'Greater Vancouver/Lower Mainland': 'Grand Vancouver/Lower Mainland',
		Montreal: 'Montréal',
		Commuter: 'Train de banlieue',
		Subway: 'Métro',
		LRT: 'TLR'
	};
	const LEVEL_FR = { Low: 'Faible', High: 'Élevée' };
	const POTENTIAL_FR = {
		'Very Low': 'Très faible',
		Low: 'Faible',
		Moderate: 'Modéré',
		High: 'Élevé',
		'Very High': 'Très élevé'
	};
	const trGroup = (g) => (fr ? (GROUP_FR[g] ?? g) : g);
	const frNumber = (d) => (isNaN(+d) || d === null ? d : formatNumber(+d, undefined, lang));
	const tooltipRows = fr
		? [
				{
					key: 'LAQuadrant',
					label: 'Disponibilité des terrains',
					format: (v) => LEVEL_FR[v] ?? v
				},
				{ key: 'GPQuadrant', label: 'Pression de croissance', format: (v) => LEVEL_FR[v] ?? v },
				{ key: 'potential', label: 'Potentiel global', format: (v) => POTENTIAL_FR[v] ?? v }
			]
		: [
				{ key: 'LAQuadrant', label: 'Land Availability' },
				{ key: 'GPQuadrant', label: 'Growth Pressure' },
				{ key: 'potential', label: 'Overall Potential' }
			];

	let { visible, highlightIds = $bindable([]), region = undefined } = $props();
	let initialData = $state([]);
	let selectedRegion = $state('All');

	$effect(() => {
		if (region) {
			selectedRegion = region;
		} else {
			selectedRegion = 'All';
		}
	});

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/development/tech_scatter.csv';
		try {
			const response = await fetch(url);
			const text = await response.text();
			initialData = csvParse(text, autoType);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const processedData = $derived(
		initialData.map((d, i) => ({
			...d,
			id: `${d.id}_${d.technology}_${i}`,
			x: d.LandAvailability,
			y: d.GrowthPressure,
			label: d.stop_label,
			group: d.technology
		}))
	);

	const colors = ['#000000', '#2a5cac', '#f1c500', '#43b171'];

	const regions = $derived(['All', ...new Set(initialData.map((d) => d.technology))]);

	const xMedian = $derived(median(processedData, (d) => d.x));
	const yMedian = $derived(median(processedData, (d) => d.y));

	const xDomainFixed = $derived.by(() => {
		if (initialData.length === 0) return [0, 1];
		return [0, xMedian * 2];
	});
	const yDomainFixed = $derived.by(() => {
		if (initialData.length === 0) return [0, 1];
		return [0, Math.max(...initialData.map((d) => d.GrowthPressure)) * 1.05];
	});

	const seriesConfig = $derived(
		regions.map((region, i) => ({
			key: region,
			label: trGroup(region),
			color: colors[i % colors.length]
		}))
	);

	const quadrantConfig = $derived({
		xMid: xMedian,
		yMid: yMedian,
		colors: ['#db3069', '#f1c500', '#00adf2', '#58e965'],
		labels: fr
			? {
					topLeft: 'Faible-Élevée',
					topRight: 'Élevée-Élevée',
					bottomLeft: 'Faible-Faible',
					bottomRight: 'Élevée-Faible'
				}
			: {
					topLeft: 'Low-High',
					topRight: 'High-High',
					bottomLeft: 'Low-Low',
					bottomRight: 'High-Low'
				}
	});
</script>

<div class="scatter-container">
	<div class="controls">
		<div class="filter-wrap">
			<Icon icon="mdi:filter-variant" />
			<span class="label">{fr ? 'Technologie :' : 'Technology:'}</span>
			<select
				bind:value={selectedRegion}
				onchange={() => {
					highlightIds = [];
				}}
			>
				{#each regions as region}
					<option value={region}>{trGroup(region)}</option>
				{/each}
			</select>
		</div>
	</div>
	<ScatterChart
		data={processedData}
		{seriesConfig}
		xKey="x"
		yKey="y"
		zKey="group"
		padding={{
			top: 20,
			right: 20,
			bottom: 60,
			left: 60
		}}
		xLabel={fr ? 'Disponibilité des terrains' : 'Land Availability'}
		yLabel={fr ? 'Pression de croissance' : 'Growth Pressure'}
		formatLabelX={fr ? frNumber : undefined}
		formatLabelY={fr ? frNumber : undefined}
		showQuadrants={true}
		showTooltip={true}
		{quadrantConfig}
		{visible}
		{highlightIds}
		idKey="id"
		titleKey="label"
		filterRegion={selectedRegion}
		regionKey="technology"
		{tooltipRows}
		xDomain={xDomainFixed}
		yDomain={yDomainFixed}
		formatX={(d) => d}
		formatY={(d) => d}
		pointRadius={3}
	/>
</div>

<style>
	.scatter-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.controls {
		padding: 0.5rem;
		display: flex;
		align-items: center;
	}

	.filter-wrap {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
		background: #f8fafc;
		padding: 0.4rem 0.75rem;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
	}

	.filter-wrap :global(svg) {
		color: #64748b;
		font-size: 1.1rem;
	}

	.filter-wrap .label {
		font-size: 0.8rem;
		font-weight: 700;
		color: #475569;
		text-transform: uppercase;
	}

	select {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid transparent;
		font-family: inherit;
		background: transparent;
		font-size: 0.9rem;
		font-weight: 600;
		color: #1e293b;
		cursor: pointer;
		outline: none;
	}

	select:hover {
		background: rgba(0, 0, 0, 0.05);
	}
</style>
