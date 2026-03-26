<script>
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, xGet, yGet, zGet } = getContext('LayerCake');

	let { visible = undefined } = $props();

	const reveal = tweened(0, {
		duration: 60000,
		easing: cubicOut
	});

	let group;

	onMount(() => {
		if (typeof visible !== 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
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

	const path = $derived((values) => {
		return (
			'M' +
			values
				.map((d) => {
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
			stroke-dashoffset={dashArray * (1 - $reveal)}
			opacity={$reveal > 1e-4 ? 1 : 0}
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
