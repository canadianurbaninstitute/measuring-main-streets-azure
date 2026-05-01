<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, zGet, yScale } = getContext('LayerCake');

	let { opacity = 0.5, visible = true } = $props();

	const areaPath = $derived((series) => {
		const values = series.values;
		const seriesKey = series.key;

		// Top edge of the area (the current series values, which are the stacked y1)
		const topPoints = values.map((d) => $xGet(d) + ',' + $yGet(d));

		// Bottom edge of the area
		// We use the stored _stack[key].y0 to find the baseline for this series at each point.
		// If not stacked, we fall back to the 0 baseline.
		const bottomPoints = [...values].reverse().map((d) => {
			const y0 = d._stack && d._stack[seriesKey] ? d._stack[seriesKey].y0 : 0;
			return $xGet(d) + ',' + $yScale(y0);
		});

		return 'M' + topPoints.join('L') + 'L' + bottomPoints.join('L') + 'Z';
	});
</script>

<g class="area-group">
	{#each $data as series}
		<path
			class="path-area"
			d={areaPath(series)}
			fill={$zGet(series)}
			style="opacity: {visible ? opacity : 0}; transition: opacity 0.5s ease;"
		></path>
	{/each}
</g>

<style>
	.path-area {
		stroke: none;
	}
</style>
