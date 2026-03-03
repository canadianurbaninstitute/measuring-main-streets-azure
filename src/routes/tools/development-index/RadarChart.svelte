<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import RadarInner from '../../lib/ui/chartcomponents/RadarInner.svg.svelte';

	let {
		data = [
			{ label: 'Single Unit Dwellings', value: 0 },
			{ label: 'Total Developable Land', value: 0 },
			{ label: 'High Opportunity Sites', value: 0 },
			{ label: 'Employment Density', value: 0 },
			{ label: 'Population Density', value: 0 }
		],
		size = 300,
		max = 100,
		color = '#ff007f'
	} = $props();

	// LayerCake needs wide-format: [{ 'Label A': 80, 'Label B': 60, ... }]
	const lcData = $derived([Object.fromEntries(data.map((d) => [d.label, (d.value / max) * 100]))]);

	const xKeys = $derived(data.map((d) => d.label));
</script>

<div class="chart-container" style="width:{size}px; height:{size}px;">
	<LayerCake data={lcData} x={xKeys}>
		<Svg>
			<RadarInner fill={color} stroke={color} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		margin: 0 auto;
	}
</style>
