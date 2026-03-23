<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, zGet, yScale } = getContext('LayerCake');

	const reveal = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	let group;

	onMount(() => {
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
			{ threshold: 0.1 }
		);

		if (group) observer.observe(group);

		return () => observer.disconnect();
	});

	$: columnWidth = (d) => {
		const xVals = $xGet(d);
		return (xVals[1] - xVals[0]) * $reveal;
	};
</script>

<g bind:this={group} class="bar-group">
	{#each $data as series}
		{#each series as d, i}
			<rect
				class="group-rect"
				data-id={i}
				x={$xGet(d)[0]}
				y={$yGet(d)}
				height={$yScale.bandwidth()}
				width={columnWidth(d)}
				fill={$zGet(series)}
				opacity={1}
			></rect>
		{/each}
	{/each}
</g>
