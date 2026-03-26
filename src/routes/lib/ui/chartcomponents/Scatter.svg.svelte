<script>
	import { getContext, onMount } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const context = getContext('LayerCake');
	const { data, xGet, yGet, xScale, yScale } = context;

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
		visible = true,
		found = $bindable(null),
		e = $bindable(null),
		showLabels = false,
		labelKey = null
	} = $props();

	const reveal = tweened(0, {
		duration: 800,
		easing: backOut
	});

	let group = $state();

	onMount(() => {
		if (visible) return;
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
		if (visible) {
			reveal.set(1);
		} else {
			reveal.set(0, { duration: 0 });
		}
	});
</script>

<g bind:this={group} class="scatter-group">
	{#each $data as d, i}
		<circle
			cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
			cy={$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
			r={(typeof r === 'number' ? r : rGet_fn(d)) * $reveal || 5}
			fill={typeof zGet_fn === 'function' ? zGet_fn(d) : fill}
			{stroke}
			stroke-width={strokeWidth}
			opacity={$reveal}
			class="scatter-point"
			style="z-index: 1; transition: cx 0.4s, cy 0.4s; transition-delay: {i * 2}ms;"
			onmousemove={(ev) => {
				found = d;
				e = ev;
			}}
			onmouseleave={() => {
				found = null;
				e = null;
			}}
		/>
		{#if showLabels && labelKey && d[labelKey]}
			<text
				x={$xGet(d) + 8}
				y={$yGet(d) + 4}
				font-size="10px"
				fill="#333"
				font-weight="normal"
				style="user-select: none; z-index: -10; transition: x 0.4s, y 0.4s; transition-delay: {i *
					2}ms;"
			>
				{d[labelKey]}
			</text>
		{/if}
	{/each}
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
