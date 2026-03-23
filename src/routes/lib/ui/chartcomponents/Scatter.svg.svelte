<script>
	import { getContext, onMount } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

	/** @type {Number} [r=5] – The circle's radius. */
	export let r = 5;

	/** @type {String} [fill='#0cf'] – The circle's fill color. */
	export let fill = '#0cf';

	/** @type {String} [stroke='#000'] – The circle's stroke color. */
	export let stroke = '#000';

	/** @type {Number} [strokeWidth=0] – The circle's stroke width. */
	export let strokeWidth = 0;

	const reveal = tweened(0, {
		duration: 800,
		easing: backOut
	});

	let group;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
					} else {
						reveal.set(0);
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (group) observer.observe(group);

		return () => observer.disconnect();
	});
</script>

<g bind:this={group} class="scatter-group">
	{#each $data as d, i}
		<circle
			cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
			cy={$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
			r={r * $reveal}
			{fill}
			{stroke}
			stroke-width={strokeWidth}
			opacity={$reveal}
			style="transition: cx 0.4s, cy 0.4s; transition-delay: {i * 2}ms;"
		/>
	{/each}
</g>
