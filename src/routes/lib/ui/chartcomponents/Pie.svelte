<script>
	import { arc as d3Arc, pie as d3Pie } from 'd3';
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { data, x, y, zScale, width, height } = getContext('LayerCake');

	let {
		innerRadius = 0, // 0 to 1, for donut chart
		padAngle = 0,
		cornerRadius = 2,
		stroke = '#fff',
		found = $bindable(null),
		e = $bindable(null),
		explode = [], // array of xKey values to offset e.g. ['Calgary', 'Montreal']
		explodeDistance = 20,
		visible = false,
		onSliceClick = null,
		drillableKeys = []
	} = $props();

	const radius = $derived(Math.min($width || 450, $height || 450) / 2);

	const reveal = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	let group;

	onMount(() => {
		if (visible) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						reveal.set(1);
					} else if (entry.intersectionRatio === 0) {
						reveal.set(0, { duration: 0 }); // reset instantly when out of view
					}
				});
			},
			{ threshold: [0, 1] }
		);

		if (group) observer.observe(group);

		return () => observer.disconnect();
	});

	// Re-trigger animation when 'visible' becomes true (scrollytelling)
	$effect(() => {
		if (visible) {
			reveal.set(1);
		} else {
			reveal.set(0, { duration: 0 });
		}
	});

	const pieGenerator = $derived(
		d3Pie()
			.value((d) => +$y(d)) // call $y as a function
			.sort(null)
	);

	const arcGenerator = $derived(
		d3Arc()
			.innerRadius(radius * (innerRadius || 0))
			.outerRadius(radius)
			.padAngle(padAngle)
			.cornerRadius(cornerRadius)
	);

	const arcs = $derived($data && $data.length ? pieGenerator($data) : []);

	const explodeTransform = $derived((d) => {
		if (!explode.includes($x(d.data))) return '';

		// find the angular span of all exploded slices combined
		const explodedArcs = arcs.filter((a) => explode.includes($x(a.data)));
		const groupStart = Math.min(...explodedArcs.map((a) => a.startAngle));
		const groupEnd = Math.max(...explodedArcs.map((a) => a.endAngle));

		// use the group midpoint for all slices in the group
		const midAngle = (groupStart + groupEnd) / 2;
		const dx = Math.sin(midAngle) * explodeDistance;
		const dy = -Math.cos(midAngle) * explodeDistance;
		return `translate(${dx}, ${dy})`;
	});
</script>

<g
	bind:this={group}
	transform="translate({($width || 450) / 2}, {($height || 450) / 2})"
	data-test="pie-group"
>
	{#each arcs as d}
		{@const animatedD = {
			...d,
			startAngle: d.startAngle * $reveal,
			endAngle: d.endAngle * $reveal
		}}
		<path
			d={arcGenerator(animatedD)}
			fill={d.data.color || $zScale($x(d.data))}
			transform={explodeTransform(d)}
			{stroke}
			stroke-width="1"
			onclick={() => onSliceClick?.(d.data)}
			style="cursor: {drillableKeys.includes($x(d.data)) ? 'pointer' : 'default'}"
			opacity={$reveal}
			onmousemove={(ev) => {
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
