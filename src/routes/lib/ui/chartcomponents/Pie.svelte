<script lang="ts">
	import { arc as d3Arc, pie as d3Pie } from 'd3';
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const { data, x, y, zScale, width, height } = getContext<{
		data: Readable<any[]>;
		x: Readable<(d: any) => any>;
		y: Readable<(d: any) => number>;
		zScale: Readable<(d: any) => string>;
		width: Readable<number>;
		height: Readable<number>;
	}>('LayerCake');

	interface Props {
		innerRadius?: number;
		padAngle?: number;
		cornerRadius?: number;
		stroke?: string;
		found?: any;
		e?: MouseEvent | null;
		explode?: string[];
		explodeDistance?: number;
		visible?: boolean | undefined;
		onSliceClick?: ((sliceData: any) => void) | null;
		drillableKeys?: string[];
	}

	let {
		innerRadius = 0,
		padAngle = 0,
		cornerRadius = 2,
		stroke = '#fff',
		found = $bindable(null),
		e = $bindable(null),
		explode = [],
		explodeDistance = 20,
		visible = undefined,
		onSliceClick = null,
		drillableKeys = []
	}: Props = $props();

	const radius = $derived(Math.min($width || 450, $height || 450) / 2);

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

	const pieGenerator = $derived(
		d3Pie<any>()
			.value((d) => +$y(d))
			.sort(null)
	);

	const arcGenerator = $derived(
		d3Arc<any, any>()
			.innerRadius(radius * (innerRadius || 0))
			.outerRadius(radius)
			.padAngle(padAngle)
			.cornerRadius(cornerRadius)
	);

	const arcs = $derived($data && $data.length ? pieGenerator($data) : []);

	const explodeTransform = $derived((d: any) => {
		if (!explode.includes($x(d.data))) return '';

		const explodedArcs = arcs.filter((a: any) => explode.includes($x(a.data)));
		const groupStart = Math.min(...explodedArcs.map((a: any) => a.startAngle));
		const groupEnd = Math.max(...explodedArcs.map((a: any) => a.endAngle));

		const midAngle = (groupStart + groupEnd) / 2;
		const dx = Math.sin(midAngle) * explodeDistance;
		const dy = -Math.cos(midAngle) * explodeDistance;
		return `translate(${dx}, ${dy})`;
	});

	function handleKeyDown(event: KeyboardEvent, sliceData: any) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSliceClick?.(sliceData);
		}
	}
</script>

<g
	bind:this={group}
	transform="translate({($width || 450) / 2}, {($height || 450) / 2})"
	data-test="pie-group"
>
	{#each arcs as d}
		{@const animatedD = {
			...d,
			startAngle: d.startAngle * reveal.current,
			endAngle: d.endAngle * reveal.current
		}}
		<path
			role="button"
			tabindex={0}
			aria-label={$x(d.data)}
			d={arcGenerator(animatedD)}
			fill={d.data.color || $zScale($x(d.data))}
			transform={explodeTransform(d)}
			{stroke}
			stroke-width="1"
			onclick={() => onSliceClick?.(d.data)}
			onkeydown={(ev) => handleKeyDown(ev, d.data)}
			style="cursor: {drillableKeys.includes($x(d.data)) ? 'pointer' : 'default'}"
			opacity={reveal.current}
			onmousemove={(ev: MouseEvent) => {
				found = d.data;
				e = ev;
			}}
			onmouseleave={() => {
				found = null;
				e = null;
			}}
		>
			<title>{$x(d.data)}: {$y(d.data)}</title>
		</path>
	{/each}
</g>
