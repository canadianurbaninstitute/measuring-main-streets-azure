<script>
	import Icon from '@iconify/svelte';
	import { median } from 'd3-array';
	import { onMount } from 'svelte';
	import ScatterChart from '../../../../lib/ui/charts/ScatterChart.svelte';

	let { visible, tier = 'Core', highlightIds = $bindable([]), region = undefined } = $props();
	let selectedRegion = $state('All');

	// Allow the region to be controlled externally by props (e.g. from scrollytelling)
	$effect(() => {
		if (region) {
			selectedRegion = region;
		}
	});

	let initialData = $state([]);
	onMount(async () => {
		let url = '';
		if (tier === 'Core') {
			url =
				'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/core_access_by_pop.json';
		} else if (tier === 'Additional') {
			url =
				'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/additional_access_by_pop.json';
		}
		try {
			const response = await fetch(url);

			initialData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const processedData = $derived(
		initialData.map((d) => ({
			...d,
			x: d.w_population,
			y: d.w_access,
			label: d.stop_label,
			group: d.region
		}))
	);

	const colors = ['#000000', '#002940', '#2a5cac', '#43b171', '#f13737', '#f45d01', '#8a4285'];

	const regions = $derived(['All', ...new Set(initialData.map((d) => d.region))]);

	// Calculate fixed domains based on ALL data so the axes don't jump when filtering
	const xDomainFixed = $derived.by(() => {
		if (initialData.length === 0) return [0, 500];
		return [0, Math.max(...initialData.map((d) => d.w_population)) * 1.05];
	});
	const yDomainFixed = $derived.by(() => {
		if (initialData.length === 0) return [0, 500];
		return [0, Math.max(...initialData.map((d) => d.w_access)) * 1.05];
	});

	const seriesConfig = $derived(
		regions.map((region, i) => ({
			key: region,
			label: region,
			color: colors[i % colors.length]
		}))
	);

	const xMedian = $derived(median(processedData, (d) => d.x));
	const yMedian = $derived(median(processedData, (d) => d.y));

	const quadrantConfig = $derived({
		xMid: xMedian,
		yMid: yMedian,
		colors: ['#db3069', '#f1c500', '#00adf2', '#58e965'],
		labels: {
			topLeft: 'High Access, Low Pop',
			topRight: 'High Access, High Pop',
			bottomLeft: 'Low Access, Low Pop',
			bottomRight: 'Low Access, High Pop'
		}
	});
</script>

<div class="scatter-container">
	<div class="controls">
		<div class="filter-wrap">
			<Icon icon="mdi:filter-variant" />
			<span class="label">Region:</span>
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
			padding={{
				top: 20,
				right: 20,
				bottom: 60,
				left: 60
			}}
			data={processedData}
			{seriesConfig}
			xKey="x"
			yKey="y"
			zKey="group"
			xLabel="Population (relative to regional median)"
			yLabel="Amenity Access (relative to regional median)"
			showQuadrants={true}
			showTooltip={true}
			{quadrantConfig}
			{visible}
			{highlightIds}
			idKey="id"
			titleKey="label"
			filterRegion={selectedRegion}
			regionKey="region"
			tooltipRows={[
				{ key: 'w_access_tag', label: 'Access Score' },
				{ key: 'w_population_tag', label: 'Population Score' },
				{ key: 'id', label: 'ID' }
			]}
			xDomain={xDomainFixed}
			yDomain={yDomainFixed}
			formatX={(d) => d}
			formatY={(d) => d}
			pointRadius={3}
		/>
	</div>
</div>

<style>
	.scatter-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.controls {
		margin-bottom: 1.5rem;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.filter-wrap {
		display: flex;
		width: 100%;
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
		width: 100%;
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
