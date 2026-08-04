<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, y, xScale, yScale, zScale, zDomain } = getContext<{
		data: Readable<any[]>;
		y: Readable<(d: any) => any>; // Imported the y-accessor function
		xScale: Readable<(d: any) => number>;
		yScale: Readable<any>;
		zScale: Readable<(d: any) => string>;
		zDomain: Readable<string[]>;
	}>('LayerCake');

	interface Props {
		visible?: boolean | undefined;
		found?: any;
		e?: MouseEvent | null;
		onSliceClick?: ((sliceData: any) => void) | null;
	}

	let {
		visible = undefined,
		found = $bindable(null),
		e = $bindable(null),
		onSliceClick = null
	}: Props = $props();

	const reveal = new Tween(0, {
		duration: 1200,
		easing: cubicOut
	});

	let group = $state<SVGGElement | undefined>();

	// Create a sub-scale for grouped bars within the category band
	const ySubScale = $derived(
		scaleBand().domain($zDomain).range([0, $yScale.bandwidth()]).paddingInner(0.05)
	);

	onMount(() => {
		if (typeof visible !== 'undefined') return;
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
			{ threshold: 0.5 }
		);

		if (group) observer.observe(group);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (typeof visible !== 'undefined') {
			if (visible) {
				reveal.target = 1;
			} else {
				reveal.set(0, { duration: 0 });
			}
		}
	});
</script>

<g bind:this={group} class="bar-group">
	{#each $data as d, i}
		{#each $zDomain as key}
			<rect
				role="button"
				tabindex={0}
				aria-label={String(d[key])}
				class="group-rect"
				data-id={i}
				x={Math.min($xScale(0), $xScale(d[key]))}
				y={$yScale($y(d)) + (ySubScale(key) ?? 0)}
				height={ySubScale.bandwidth()}
				width={Math.abs($xScale(d[key]) - $xScale(0)) * reveal.current}
				fill={$zScale(key)}
				onmousemove={(ev: MouseEvent) => {
					found = { ...d, _key: key, _value: d[key] };
					e = ev;
				}}
				onkeydown={(ev: KeyboardEvent) => {
					if (ev.key === 'Enter' || ev.key === ' ') {
						ev.preventDefault();
						onSliceClick?.(d);
					}
				}}
				onmouseleave={() => {
					found = null;
					e = null;
				}}
			></rect>
		{/each}
	{/each}
</g>

<style>
	.group-rect {
		transition: opacity 0.2s;
	}
	.group-rect:hover {
		opacity: 0.8;
	}
</style>
