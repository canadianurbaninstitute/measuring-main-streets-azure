<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, xScale, yScale, extents } = getContext('LayerCake');

	/**  @type {String} [fill='#ab00d610'] The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let fill = '#ab00d610';

	const reveal = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	let pathElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
					} else {
						reveal.set(0);
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (pathElement) observer.observe(pathElement);

		return () => observer.disconnect();
	});

	$: yRange = $yScale.range();
	$: baseline = yRange[0];

	$: path =
		'M' +
		$data
			.map((d) => {
				const x = $xGet(d);
				const y = $yGet(d);
				const animatedY = baseline + (y - baseline) * $reveal;
				return x + ',' + animatedY;
			})
			.join('L');

	let area;

	$: {
		area =
			path +
			('L' +
				$xScale($extents.x ? $extents.x[1] : 0) +
				',' +
				baseline +
				'L' +
				$xScale($extents.x ? $extents.x[0] : 0) +
				',' +
				baseline +
				'Z');
	}
</script>

<path bind:this={pathElement} class="path-area" d={area} {fill} opacity={$reveal}></path>
