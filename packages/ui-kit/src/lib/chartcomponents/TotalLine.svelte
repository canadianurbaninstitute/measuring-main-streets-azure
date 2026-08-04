<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yScale } = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yScale: Readable<(d: any) => number>;
	}>('LayerCake');

	interface Props {
		stroke?: string;
		yKey?: string;
		strokeWidth?: number;
		dashed?: boolean;
		visible?: boolean;
		dataset?: any[] | undefined;
	}

	let {
		stroke = '#000000',
		yKey = '_total',
		strokeWidth = 3,
		dashed = true,
		visible = true,
		dataset = undefined
	}: Props = $props();

	const reveal = new Tween(0, {
		duration: 1500,
		easing: cubicOut
	});

	let pathElement = $state<SVGPathElement | undefined>();

	onMount(() => {
		if (typeof visible !== 'undefined' && pathElement === undefined) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.target = 1;
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

	$effect(() => {
		if (visible) {
			reveal.target = 1;
		} else {
			reveal.set(0, { duration: 0 });
		}
	});

	const points = $derived(
		(dataset || $data).map((d) => {
			return $xGet(d) + ',' + $yScale(d[yKey]);
		})
	);

	const path = $derived('M' + points.join('L'));

	const dashArray = 10000;
</script>

<path
	bind:this={pathElement}
	class="path-total-line"
	d={path}
	{stroke}
	stroke-width={strokeWidth}
	stroke-dasharray={dashed ? '5,5' : dashArray}
	stroke-dashoffset={dashed ? 0 : dashArray * (1 - reveal.current)}
	opacity={visible ? reveal.current : 0}
	style="transition: opacity 0.5s ease;"
></path>

<style>
	.path-total-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
</style>
