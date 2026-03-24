<script>
	import { getContext } from 'svelte';

	const { xScale, yScale } = getContext('LayerCake');

	let {
		x1 = 0,
		y1 = 0,
		x2 = 0,
		y2 = 0,
		stroke = '#999',
		strokeWidth = 1,
		strokeDasharray = '4 4'
	} = $props();

	// Calculate pixel coordinates based on scales
	const coords = $derived({
		px1: $xScale(x1),
		py1: $yScale(y1),
		px2: $xScale(x2),
		py2: $yScale(y2)
	});
</script>

<line
	x1={coords.px1}
	y1={coords.py1}
	x2={coords.px2}
	y2={coords.py2}
	stroke={stroke}
	stroke-width={strokeWidth}
	stroke-dasharray={strokeDasharray}
	class="reference-line"
/>

<style>
	.reference-line {
		pointer-events: none;
	}
</style>
