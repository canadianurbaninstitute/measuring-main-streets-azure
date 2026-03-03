<script lang="ts">
	import { getContext } from 'svelte';
	import { line, curveCardinalClosed } from 'd3-shape';

	const { data, width, height } = getContext('LayerCake');

	let {
		fill = '#ff007f',
		stroke = '#ff007f',
		strokeWidth = 2,
		fillOpacity = 0.3,
		r = 4,
		levels = 4
	} = $props();

	const cx = $derived($width / 2);
	const cy = $derived($height / 2);
	const radius = $derived(Math.min($width, $height) / 2 - 40);
	const keys = $derived(Object.keys($data[0]));
	const angleSlice = $derived((Math.PI * 2) / keys.length);
	const rScale = $derived((v) => (v / 100) * radius);

	const radarLine = $derived(
		line()
			.x((d) => d[0])
			.y((d) => d[1])
			.curve(curveCardinalClosed.tension(0))
	);

	const polygons = $derived(
		$data.map((row) =>
			keys.map((key, i) => {
				const scaled = rScale(row[key] ?? 0);
				return [
					cx + scaled * Math.cos(angleSlice * i - Math.PI / 2),
					cy + scaled * Math.sin(angleSlice * i - Math.PI / 2)
				];
			})
		)
	);

	const rings = $derived(
		Array.from({ length: levels }, (_, i) => radius * ((levels - i) / levels))
	);

	const axes = $derived(
		keys.map((key, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			const lx = cx + (radius + 22) * Math.cos(angle);
			const ly = cy + (radius + 22) * Math.sin(angle);
			return {
				key,
				x2: cx + radius * Math.cos(angle),
				y2: cy + radius * Math.sin(angle),
				lx,
				ly,
				anchor: Math.abs(lx - cx) < 1 ? 'middle' : lx < cx ? 'end' : 'start'
			};
		})
	);
</script>

<g>
	{#each rings as rr}
		<circle {cx} {cy} r={rr} fill="none" stroke="#e5e7eb" stroke-width="1.5" />
	{/each}

	{#each axes as axis}
		<line x1={cx} y1={cy} x2={axis.x2} y2={axis.y2} stroke="#e5e7eb" stroke-width="1.5" />
	{/each}

	{#each polygons as points}
		{@const d = radarLine(points) ?? ''}
		<path
			{d}
			{fill}
			fill-opacity={fillOpacity}
			{stroke}
			stroke-width={strokeWidth}
			style="transition: d 0.5s ease-in-out;"
		/>
		{#each points as [px, py]}
			<circle cx={px} cy={py} {r} fill={stroke} style="transition: all 0.5s ease-in-out;" />
		{/each}
	{/each}

	{#each axes as axis}
		<text
			x={axis.lx}
			y={axis.ly}
			font-size="10"
			font-family="Inter, sans-serif"
			fill="#6b7280"
			text-anchor={axis.anchor}
			dominant-baseline="middle"
		>
			{axis.key}
		</text>
	{/each}
</g>
