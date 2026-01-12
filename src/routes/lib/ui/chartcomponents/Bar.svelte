<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

	/** @type {String} [fill='#00bbff'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let fill = '#00bbff';
</script>

<g class="bar-group">
	{#each $data as d, i}
		<rect
			class="group-rect"
			data-id={i}
			x={Math.min($xScale(0), $xGet(d))}
			y={$yGet(d)}
			height={$yScale.bandwidth()}
			width={Math.abs($xGet(d) - $xScale(0))}
			{fill}
		/>
	{/each}
</g>

<style>
	.bar-group {
		width: 100%;
		min-width: 1px;
	}
</style>
