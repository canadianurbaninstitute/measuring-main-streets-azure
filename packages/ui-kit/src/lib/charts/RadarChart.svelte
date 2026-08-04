<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import RadarInner from '../chartcomponents/RadarInner.svg.svelte';

	let {
		data = [], // [{ label: 'Single Unit Dwellings', value: 80 }, ...]
		xKey = 'label',
		yKey = 'value',
		title = '',
		max = 100,
		color = '#ff007f',
		height = '600px'
	} = $props();

	// LayerCake needs wide-format: [{ 'Label A': 80, 'Label B': 60, ... }]
	// We normalize the values based on the 'max' prop.
	const lcData = $derived(
		data.length > 0 ? [Object.fromEntries(data.map((d) => [d[xKey], (d[yKey] / max) * 100]))] : []
	);

	const xKeys = $derived(data.map((d) => d[xKey]));
</script>

<div class="chart-container">
	{#if title}
		<h4>{title}</h4>
	{/if}

	<div class="chart" style:height>
		<LayerCake data={lcData} x={xKeys}>
			<Svg>
				<RadarInner fill={color} stroke={color} />
			</Svg>
		</LayerCake>
	</div>
</div>

<style>
	.chart {
		width: 100%;
		margin: 0 auto;
		aspect-ratio: 1;
		padding: 2rem;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
	}
</style>
