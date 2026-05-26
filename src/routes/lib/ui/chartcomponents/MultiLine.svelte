<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yGet, zGet } = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yGet: Readable<(d: any) => number>;
		zGet: Readable<(series: any) => string>;
	}>('LayerCake');

	interface Props {
		visible?: boolean | undefined;
	}

	let { visible = undefined }: Props = $props();

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
					} else if (entry.intersectionRatio === 0) {
						reveal.set(0, { duration: 0 });
					}
				});
			},
			{ threshold: [0.5] }
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

	const path = $derived((values: any[]) => {
		return (
			'M' +
			values
				.map((d: any) => {
					return $xGet(d) + ',' + $yGet(d);
				})
				.join('L')
		);
	});

	const dashArray = 10000;
</script>

<g bind:this={group} class="line-group">
	{#each $data as series}
		<path
			class="path-line"
			d={path(series.values)}
			stroke={$zGet(series)}
			stroke-dasharray={dashArray}
			stroke-dashoffset={dashArray * (1 - reveal.current)}
			opacity={reveal.current > 1e-4 ? 1 : 0}
		></path>
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
	}
</style>
