<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

	/** @type {String} [fill='#00bbff'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let fill = '#00bbff';

	const reveal = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	let group;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
					} else {
						reveal.set(0, { duration: 0 });
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (group) observer.observe(group);

		return () => observer.disconnect();
	});
</script>

<g bind:this={group} class="bar-group">
	{#each $data as d, i}
		<rect
			class="group-rect"
			data-id={i}
			x={Math.min($xScale(0), $xGet(d))}
			y={$yGet(d)}
			height={$yScale.bandwidth()}
			width={Math.abs($xGet(d) - $xScale(0)) * $reveal}
			{fill}
			opacity={1}
		/>
	{/each}
</g>

<style>
	.bar-group {
		width: 100%;
		min-width: 1px;
	}
</style>
