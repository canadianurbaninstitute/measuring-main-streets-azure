<script>
	import { scaleBand } from 'd3-scale';
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, xScale, yScale, zGet, zScale, zDomain } = getContext('LayerCake');

	let { visible = undefined, found = $bindable(null), e = $bindable(null) } = $props();

	const reveal = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	let group = $state();

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
						reveal.set(1);
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
				reveal.set(1);
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
				class="group-rect"
				data-id={i}
				x={Math.min($xScale(0), $xScale(d[key]))}
				y={$yGet(d) + ySubScale(key)}
				height={ySubScale.bandwidth()}
				width={Math.abs($xScale(d[key]) - $xScale(0)) * $reveal}
				fill={$zScale(key)}
				onmousemove={(ev) => {
					found = { ...d, _key: key, _value: d[key] };
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

<style>
	.group-rect {
		transition: opacity 0.2s;
	}
	.group-rect:hover {
		opacity: 0.8;
	}
</style>
