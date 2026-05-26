<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	// 1. Explicitly type LayerCake context elements
	const { data, xGet, yGet, yScale, zScale, config } = getContext<{
		data: Readable<Record<string, any>[]>;
		xGet: Readable<(d: Record<string, any>) => number[]>;
		yGet: Readable<(d: Record<string, any>) => number>;
		yScale: Readable<any>;
		zScale: Readable<(key: string) => string>;
		config: Readable<{ x: string[]; [key: string]: any }>;
	}>('LayerCake');

	// 2. Define standard interface for component properties
	interface Props {
		r?: number;
	}

	let { r = 6 }: Props = $props();

	// 3. Use safe navigation in case bandwidth isn't available on linear/log scales
	let midHeight = $derived(typeof $yScale.bandwidth === 'function' ? $yScale.bandwidth() / 2 : 0);
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
