<script>
	import { getContext, onMount } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const context = getContext('LayerCake');
	const { data, xGet, yGet, xScale, yScale, z, r: rKey } = context;

	// Use runes to hold the values of optional stores.
	// We avoid the '$' syntax here because subscribing to an undefined store crashes.
	let zGet_fn = $state(null);
	let rGet_fn = $state(null);

	if (context.zGet) context.zGet.subscribe((v) => (zGet_fn = v));
	if (context.rGet) context.rGet.subscribe((v) => (rGet_fn = v));

	let {
		r = 5,
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
	} = $props();

	const isHighlighted = (d) => {
		// If a region is filtered, we shouldn't show highlights for points outside that region
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

	const isDimmed = (d) => {
		// Dim if a specific highlight is active and this isn't it
		const highlightActive = Array.isArray(highlightIds) ? highlightIds.length > 0 : !!highlightIds;
		if (highlightActive && !isHighlighted(d)) return true;

		// Dim if a region filter is active and this isn't it
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

	let group = $state();

	onMount(() => {
		if (typeof visible !== 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
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
				reveal.set(1);
			} else {
				reveal.set(0, { duration: 0 });
			}
		}
	});

	// We want to render highlighted dots last so they are on top.
	// We should also render the "active" region dots after dimmed ones.
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

			// Fallback to ID for stable order otherwise
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
				aria-label={d[labelKey] || 'Data point'}
				cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
				cy={$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
				r={(highlighted ? 1.5 : 1) *
					(typeof r === 'number' ? r : $rKey && typeof rGet_fn === 'function' ? rGet_fn(d) : 5) *
					reveal.current || 5}
				fill={dim ? '#555' : $z && typeof zGet_fn === 'function' ? zGet_fn(d) : fill}
				stroke={highlighted ? '#fff' : dim ? '#cbd5e1' : stroke}
				stroke-width={highlighted ? 2 : strokeWidth}
				opacity={dim ? 0.5 : reveal.current}
				class="scatter-point"
				class:is-highlighted={highlighted}
				class:is-dimmed={dim}
				style="transition: r 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s;"
				onmousemove={(ev) => {
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
