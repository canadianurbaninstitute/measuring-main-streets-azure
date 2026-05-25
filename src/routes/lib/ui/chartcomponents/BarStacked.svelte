<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, zGet, yScale } = getContext('LayerCake');

	const reveal = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	let { visible = undefined, found = $bindable(null), e = $bindable(null) } = $props();

	let group = $state();

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

	// Re-trigger animation when 'visible' becomes true (scrollytelling)
	$effect(() => {
		if (typeof visible !== 'undefined') {
			if (visible) {
				reveal.set(1);
			} else {
				reveal.set(0, { duration: 0 });
			}
		}
	});

	const columnWidth = $derived((d) => {
		const xVals = $xGet(d);
		return (xVals[1] - xVals[0]) * $reveal;
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
				onmousemove={(ev) => {
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
