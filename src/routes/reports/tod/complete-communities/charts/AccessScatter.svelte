<script lang="ts">
	import Icon from '@iconify/svelte';
	import { median } from 'd3-array';
	import { onMount } from 'svelte';
	import ScatterChart from '../../../../lib/ui/charts/ScatterChart.svelte';

	interface RawDataItem {
		w_population: number;
		w_access: number;
		stop_label: string;
		region: string;
		id: string | number;
		w_access_tag?: string | number;
		w_population_tag?: string | number;
		[key: string]: any;
	}

	interface ProcessedDataItem extends RawDataItem {
		x: number;
		y: number;
		label: string;
		group: string;
	}

	interface Props {
		visible?: boolean;
		tier?: 'Core' | 'Additional';
		highlightIds?: (string | number)[];
		region?: string | undefined;
	}

	let {
		visible = false,
		tier = 'Core',
		highlightIds = $bindable([]),
		region = undefined
	}: Props = $props();

	let selectedRegion = $state('All');

	$effect(() => {
		if (region) {
			selectedRegion = region;
		}
	});

	let initialData = $state<RawDataItem[]>([]);
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
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived<ProcessedDataItem[]>(
		initialData.map((d) => ({
			...d,
			x: d.w_population,
			y: d.w_access,
			label: d.stop_label,
			group: d.region
		}))
	);

	const colors = ['#000000', '#002940', '#2a5cac', '#43b171', '#f13737', '#f45d01', '#8a4285'];

	const regions = $derived<string[]>(['All', ...new Set(initialData.map((d) => d.region))]);

	const xDomainFixed = $derived.by<[number, number]>(() => {
		if (initialData.length === 0) return [0, 500];
		return [0, Math.max(...initialData.map((d) => d.w_population)) * 1.05];
	});
	const yDomainFixed = $derived.by<[number, number]>(() => {
		if (initialData.length === 0) return [0, 500];
		return [0, Math.max(...initialData.map((d) => d.w_access)) * 1.05];
	});

	const seriesConfig = $derived(
		regions.map((reg, i) => ({
			key: reg,
			label: reg,
			color: colors[i % colors.length]
		}))
	);

	const xMedian = $derived(median(processedData, (d) => d.x) ?? 0);
	const yMedian = $derived(median(processedData, (d) => d.y) ?? 0);

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
				{#each regions as regionItem}
					<option value={regionItem}>{regionItem}</option>
				{/each}
			</select>
		</div>
	</div>
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
			{ key: 'w_population_tag', label: 'Population Score' }
		]}
		xDomain={xDomainFixed}
		yDomain={yDomainFixed}
		pointRadius={3}
	/>
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
</style>
