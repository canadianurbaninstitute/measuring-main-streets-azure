<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yGet, zGet, yScale } = getContext<{
		data: Readable<any[][]>;
		xGet: Readable<(d: any) => [number, number]>;
		yGet: Readable<(d: any) => number>;
		zGet: Readable<(series: any[]) => string>;
		yScale: Readable<any>;
	}>('LayerCake');

	const reveal = new Tween(0, {
		duration: 1200,
		easing: cubicOut
	});

	interface Props {
		visible?: boolean | undefined;
		found?: any;
		e?: MouseEvent | null;
	}

	let { visible = undefined, found = $bindable(null), e = $bindable(null) }: Props = $props();

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

	const columnWidth = $derived((d: any) => {
		const xVals = $xGet(d);
		return (xVals[1] - xVals[0]) * reveal.current;
	});
</script>

<g bind:this={group} class="bar-group">
	{#each $data as series}
		{#each series as d, i}
			<rect
				class="group-rect"
				role="button"
				tabindex={0}
				data-id={i}
				x={$xGet(d)[0]}
				y={$yGet(d)}
				height={$yScale.bandwidth()}
				width={columnWidth(d)}
				fill={$zGet(series)}
				opacity={1}
				onmousemove={(ev: MouseEvent) => {
					found = d.data;
					e = ev;
				}}
				onmouseleave={() => {
					found = null;
					e = null;
				}}
			></rect>
		{/each}
	{/each}
</g>
