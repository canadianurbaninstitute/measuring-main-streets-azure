<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yGet, xScale, yScale } = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yGet: Readable<(d: any) => number>;
		xScale: Readable<(d: any) => number>;
		yScale: Readable<any>;
	}>('LayerCake');

	interface Props {
		fill?: string;
		visible?: boolean | undefined;
		highlightValue?: string;
		highlightKey?: string;
		highlightColor?: string;
	}

	let {
		fill = '#00bbff',
		visible = undefined,
		highlightValue = '',
		highlightKey = 'name',
		highlightColor = '#f45d01'
	}: Props = $props();

	const reveal = new Tween(0, {
		duration: 1500,
		easing: cubicOut
	});

	let group = $state<SVGGElement | undefined>();

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
			{ threshold: 0.1 }
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

	function getFill(d: any) {
		if (
			highlightValue &&
			d[highlightKey] &&
			String(d[highlightKey]).toLowerCase() === highlightValue.toLowerCase()
		) {
			return highlightColor;
		}
		return d.color || fill;
	}
</script>

<g bind:this={group} class="bar-group">
	{#each $data as d, i}
		<rect
			class="group-rect"
			data-id={i}
			x={Math.min($xScale(0), $xGet(d))}
			y={$yGet(d)}
			height={$yScale.bandwidth()}
			width={Math.abs($xGet(d) - $xScale(0)) * reveal.current}
			fill={getFill(d)}
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
