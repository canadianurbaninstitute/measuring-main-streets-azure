<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet } = getContext('LayerCake');

	/** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let stroke = '#ab00d6';

	const reveal = tweened(0, {
		duration: 2500,
		easing: cubicOut
	});

	let pathElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
					} else if (entry.intersectionRatio === 0) {
						reveal.set(0, { duration: 0 });
					}
				});
			},
			{ threshold: [0.1] }
		);

		if (pathElement) observer.observe(pathElement);

		return () => observer.disconnect();
	});

	$: path =
		'M' +
		$data
			.map((d) => {
				return $xGet(d) + ',' + $yGet(d);
			})
			.join('L');

	const dashArray = 10000;
</script>

<path
	bind:this={pathElement}
	class="path-line"
	d={path}
	{stroke}
	stroke-dasharray={dashArray}
	stroke-dashoffset={dashArray * (1 - $reveal)}
	opacity={$reveal > 1e-4 ? 1 : 0}
></path>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
