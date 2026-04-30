<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yScale, xScale } = getContext('LayerCake');

	export let stroke = '#000000';
	export let yKey = '_total';
	export let strokeWidth = 3;
	export let dashed = true;
	export let visible = true;

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
						reveal.set(0, { duration: 0 });
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (pathElement) observer.observe(pathElement);

		return () => observer.disconnect();
	});

	// If data is grouped (multi-series), we need to get a flat version for the total line
	// But in MultiLineChart, finalData is already flat (one row per date).
	// However, LayerCake's $data might be the grouped version.
	// So we should use the raw dataset if possible.
	export let dataset = undefined;

	$: points = (dataset || $data).map((d) => {
		return $xGet(d) + ',' + $yScale(d[yKey]);
	});

	$: path = 'M' + points.join('L');

	const dashArray = 10000;
</script>

<path
	bind:this={pathElement}
	class="path-total-line"
	d={path}
	{stroke}
	stroke-width={strokeWidth}
	stroke-dasharray={dashed ? '5,5' : dashArray}
	stroke-dashoffset={dashed ? 0 : dashArray * (1 - $reveal)}
	opacity={visible ? $reveal : 0}
	style="transition: opacity 0.5s ease;"
></path>

<style>
	.path-total-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
</style>
