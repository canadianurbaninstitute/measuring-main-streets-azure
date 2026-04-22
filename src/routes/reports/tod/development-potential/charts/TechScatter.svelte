<script>
	import Icon from '@iconify/svelte';
	import { median } from 'd3-array';
	import { autoType, csvParse } from 'd3-dsv';
	import { onMount } from 'svelte';
	import ScatterChart from '../../../../lib/ui/charts/ScatterChart.svelte';

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

	// $effect(() => {
	// 	console.log('Tech scatter:', processedData);
	// });

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
			label: region,
			color: colors[i % colors.length]
		}))
	);

	const quadrantConfig = $derived({
		xMid: xMedian,
		yMid: yMedian,
		colors: ['#db3069', '#f1c500', '#00adf2', '#58e965'],
		labels: {
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
			<span class="label">Technology:</span>
			<select
				bind:value={selectedRegion}
				onchange={() => {
					highlightIds = [];
				}}
			>
				{#each regions as region}
					<option value={region}>{region}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="chart-box">
		<ScatterChart
			data={processedData}
			{seriesConfig}
			xKey="x"
			yKey="y"
			zKey="group"
			xLabel="Land Availability"
			yLabel="Growth Pressure"
			showQuadrants={true}
			showTooltip={true}
			{quadrantConfig}
			{visible}
			{highlightIds}
			idKey="id"
			titleKey="label"
			filterRegion={selectedRegion}
			regionKey="technology"
			tooltipRows={[
				{ key: 'LAQuadrant', label: 'Land Availability' },
				{ key: 'GPQuadrant', label: 'Growth Pressure' },
				{ key: 'potential', label: 'Overall Potential' }
			]}
			xDomain={xDomainFixed}
			yDomain={yDomainFixed}
			formatX={(d) => d}
			formatY={(d) => d}
		/>
	</div>
</div>

<style>
	.scatter-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		background: white;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		padding: 1.5rem;
	}

	.controls {
		margin-bottom: 1.5rem;
		display: flex;
		justify-content: flex-start;
	}

	.filter-wrap {
		display: flex;
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

	.chart-box {
		flex: 1;
		min-height: 500px;
	}

	@media (max-width: 640px) {
		.chart-box {
			min-height: 400px;
		}
	}
</style>
