<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { Readable } from 'svelte/store';

	const context = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yGet: Readable<(d: any) => number>;
		xScale: Readable<any>;
		yScale: Readable<any>;
		z?: Readable<any>;
		r?: Readable<any>;
		zGet?: Readable<(d: any) => string>;
		rGet?: Readable<(d: any) => number>;
	}>('LayerCake');

	const { data, xGet, yGet, xScale, yScale, z, r: rKey } = context;

	let zGet_fn = $state<((d: any) => string) | null>(null);
	let rGet_fn = $state<((d: any) => number) | null>(null);

	if (context.zGet) context.zGet.subscribe((v) => (zGet_fn = v));
	if (context.rGet) context.rGet.subscribe((v) => (rGet_fn = v));

	interface Props {
		r?: number | string;
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
		visible?: boolean | undefined;
		found?: any;
		e?: MouseEvent | null;
		showLabels?: boolean;
		labelKey?: string | null;
		highlightIds?: any[] | any;
		idKey?: string;
		filterRegion?: string | string[];
		regionKey?: string;
	}

	let {
		r = 1,
		fill = '#0cf',
		stroke = '#000',
		strokeWidth = 0,
		visible = undefined,
		found = $bindable(null),
		e = $bindable(null),
		showLabels = false,
		labelKey = null,
		highlightIds = [],
		idKey = 'id',
		filterRegion = 'All',
		regionKey = 'region'
	}: Props = $props();

	const isHighlighted = (d: any) => {
		if (filterRegion && filterRegion !== 'All') {
			const activeRegions = Array.isArray(filterRegion) ? filterRegion : [filterRegion];
			if (!activeRegions.includes(d[regionKey])) return false;
		}

		if (!highlightIds) return false;
		const hIds = Array.isArray(highlightIds) ? highlightIds : [highlightIds];
		if (hIds.length === 0) return false;

		const currentId = String(d[idKey]).trim();
		return hIds.some((h) => String(h).trim() === currentId);
	};

	const isDimmed = (d: any) => {
		const highlightActive = Array.isArray(highlightIds) ? highlightIds.length > 0 : !!highlightIds;
		if (highlightActive && !isHighlighted(d)) return true;

		if (filterRegion && filterRegion !== 'All') {
			const activeRegions = Array.isArray(filterRegion) ? filterRegion : [filterRegion];
			if (!activeRegions.includes(d[regionKey])) return true;
		}

		return false;
	};

	const reveal = new Tween(0, {
		duration: 800,
		easing: backOut
	});

	let group = $state<SVGGElement | undefined>();

	onMount(() => {
		if (typeof visible !== 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.target = 1;
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

	const sortedData = $derived(
		[...$data].sort((a, b) => {
			const aH = isHighlighted(a);
			const bH = isHighlighted(b);
			if (aH && !bH) return 1;
			if (!aH && bH) return -1;

			const aD = isDimmed(a);
			const bD = isDimmed(b);
			if (!aD && bD) return 1;
			if (aD && !bD) return -1;

			return String(a[idKey]).localeCompare(String(b[idKey]));
		})
	);
</script>

<g bind:this={group} class="scatter-group">
	{#if typeof $xGet === 'function' && typeof $yGet === 'function'}
		{#each sortedData as d (d[idKey])}
			{@const highlighted = isHighlighted(d)}
			{@const dim = isDimmed(d)}
			<circle
				role="img"
				aria-label={labelKey && d[labelKey] ? d[labelKey] : 'Data point'}
				cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
				cy={$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
				r={(highlighted ? 1.5 : 1) *
					(typeof r === 'number' ? r : $rKey && typeof rGet_fn === 'function' ? rGet_fn(d) : 3) *
					reveal.current}
				fill={dim ? '#555' : $z && typeof zGet_fn === 'function' ? zGet_fn(d) : fill}
				stroke={highlighted ? '#fff' : dim ? '#cbd5e1' : stroke}
				stroke-width={highlighted ? 2 : strokeWidth}
				opacity={dim ? 0.5 : reveal.current}
				class="scatter-point"
				class:is-highlighted={highlighted}
				class:is-dimmed={dim}
				style="transition: r 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s;"
				onmousemove={(ev: MouseEvent) => {
					found = d;
					e = ev;
				}}
				onmouseleave={() => {
					found = null;
					e = null;
				}}
			/>
			{#if (showLabels || highlighted) && labelKey && d[labelKey]}
				<text
					x={$xGet(d) + 8}
					y={$yGet(d) + 4}
					font-size={highlighted ? '12px' : '10px'}
					fill={highlighted ? '#000' : '#222'}
					font-weight={highlighted ? 'bold' : 'normal'}
					opacity={dim ? 0.2 : 1}
					style="user-select: none; pointer-events: none; transition: opacity 0.3s;"
				>
					{d[labelKey]}
				</text>
			{/if}
		{/each}
	{/if}
</g>

<style>
	.scatter-point {
		pointer-events: all;
		cursor: pointer;
	}
	.scatter-point:hover {
		stroke: #000;
		stroke-width: 2px;
	}
</style>
