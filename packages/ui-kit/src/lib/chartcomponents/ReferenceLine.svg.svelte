<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { xScale, yScale } = getContext<{
		xScale: Readable<(d: any) => number>;
		yScale: Readable<(d: any) => number>;
	}>('LayerCake');

	interface Props {
		x1?: number;
		y1?: number;
		x2?: number;
		y2?: number;
		stroke?: string;
		strokeWidth?: number;
		strokeDasharray?: string;
	}

	let {
		x1 = 0,
		y1 = 0,
		x2 = 0,
		y2 = 0,
		stroke = '#999',
		strokeWidth = 1,
		strokeDasharray = '4 4'
	}: Props = $props();

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
	{stroke}
	stroke-width={strokeWidth}
	stroke-dasharray={strokeDasharray}
	class="reference-line"
/>

<style>
	.reference-line {
		pointer-events: none;
	}
</style>
