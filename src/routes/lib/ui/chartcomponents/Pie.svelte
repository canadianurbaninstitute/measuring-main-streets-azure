<script>
	import { getContext, onMount } from 'svelte';
	import { arc as d3Arc, pie as d3Pie } from 'd3';

	const { data, x, y, zScale, width, height } = getContext('LayerCake');

	let {
		innerRadius = 0, // 0 to 1, for donut chart
		padAngle = 0.03,
		cornerRadius = 2,
		stroke = '#fff'
	} = $props();

	onMount(() => {
		console.log('Pie component mounted');
		console.log('Context checks:', { 
			hasData: !!$data, 
			width: $width, 
			height: $height, 
			x: $x, 
			y: $y 
		});
	});

	const radius = $derived(Math.min($width || 450, $height || 450) / 2);

	const pieGenerator = $derived(
		d3Pie()
			.value((d) => +d[$y])
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
</script>

<g transform="translate({($width || 450) / 2}, {($height || 450) / 2})" data-test="pie-group">
	{#each arcs as d}
		<path
			d={arcGenerator(d)}
			fill={d.data.color || $zScale(d.data[$x])}
			{stroke}
			stroke-width="1"
		>
			<title>{d.data[$x]}: {d.data[$y]}</title>
		</path>
	{/each}
</g>
