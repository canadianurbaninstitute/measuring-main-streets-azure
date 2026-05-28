<script lang="ts">
	import type { ScaleBand, ScaleOrdinal } from 'd3-scale';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	interface LayerCakeContext {
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number[]>;
		yGet: Readable<(d: any) => number>;
		yScale: Readable<ScaleBand<string>>;
		zScale: Readable<ScaleOrdinal<string, string>>;
		config: Readable<{ x: string[]; y: string }>;
	}

	const { data, xGet, yGet, yScale, zScale, config } = getContext<LayerCakeContext>('LayerCake');

	interface Props {
		r?: number;
	}

	let { r = 6 }: Props = $props();

	const midHeight = $derived($yScale.bandwidth() / 2);
</script>

<g class="dot-plot">
	{#each $data as row}
		{@const yVal = $yGet(row)}
		{@const xVals = $xGet(row)}
		<g class="dot-row">
			<line
				x1={Math.min(...xVals)}
				y1={yVal + midHeight}
				x2={Math.max(...xVals)}
				y2={yVal + midHeight}
			></line>

			{#each xVals as circleX, i}
				<circle cx={circleX} cy={yVal + midHeight} {r} fill={$zScale($config.x[i])}></circle>
			{/each}
		</g>
	{/each}
</g>

<style>
	line {
		stroke-width: 1px;
		stroke: #002940;
	}
	circle {
		stroke: #002940;
		stroke-width: 1px;
	}
</style>
