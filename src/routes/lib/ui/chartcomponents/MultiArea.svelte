<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yGet, zGet, yScale } = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yGet: Readable<(d: any) => number>;
		zGet: Readable<(series: any) => string>;
		yScale: Readable<(d: any) => number>;
	}>('LayerCake');

	interface Props {
		opacity?: number;
		visible?: boolean;
	}

	let { opacity = 0.5, visible = true }: Props = $props();

	const areaPath = $derived((series: any) => {
		const values = series.values;
		const seriesKey = series.key;

		const topPoints = values.map((d: any) => $xGet(d) + ',' + $yGet(d));

		const bottomPoints = [...values].reverse().map((d: any) => {
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
