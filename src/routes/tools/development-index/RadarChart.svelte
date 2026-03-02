<script lang="ts">
	// Props
	export let data = [
		{ label: 'Single Unit Dwellings', value: 0 },
		{ label: 'Total Developable Land', value: 0 },
		{ label: 'High Opportunity Sites', value: 0 },
		{ label: 'Employment Density', value: 0 },
		{ label: 'Population Density', value: 0 }
	];

	export let size = 300;
	export let max = 100; // Expected max value for normalization
	export let color = '#ff007f'; // Pink color used in mockup

	$: cx = size / 2;
	$: cy = size / 2;
	$: radius = (size - 100) / 2; // Leave room for labels

	// Dimensions
	const levels = 4; // Number of inner circles

	// Math helpers
	$: angleSlice = (Math.PI * 2) / data.length;

	// Scale value to radius
	$: rScale = (value) => (value / max) * radius;

	// Points for the radar polygon path
	$: pathData = data.map((d, i) => {
		const r = rScale(d.value);
		const x = cx + r * Math.cos(angleSlice * i - Math.PI / 2);
		const y = cy + r * Math.sin(angleSlice * i - Math.PI / 2);
		return [x, y];
	});

	// Build SVG String
	$: dString = pathData.length > 0 ? 'M' + pathData.map((p) => p.join(',')).join('L') + 'Z' : '';
</script>

<div class="radar-container" style="width: {size}px; height: {size}px;">
	<svg width={size} height={size}>
		<!-- Concentric background circles -->
		{#each Array(levels) as _, i}
			{@const levelFactor = (levels - i) / levels}
			{@const r = radius * levelFactor}
			<circle {cx} {cy} {r} fill="none" stroke="#e5e7eb" stroke-width="1.5" />
		{/each}

		<!-- Axis Lines -->
		{#each data as _, i}
			{@const x2 = cx + radius * Math.cos(angleSlice * i - Math.PI / 2)}
			{@const y2 = cy + radius * Math.sin(angleSlice * i - Math.PI / 2)}
			<line x1={cx} y1={cy} {x2} {y2} stroke="#e5e7eb" stroke-width="1.5" />
		{/each}

		<!-- Data Polygon -->
		{#if dString}
			<path
				d={dString}
				fill={color}
				fill-opacity="0.3"
				stroke={color}
				stroke-width="2"
				style="transition: d 0.5s ease-in-out;"
			/>

			<!-- Data Points (Circles) -->
			{#each pathData as [x, y]}
				<circle cx={x} cy={y} r="4" fill={color} style="transition: all 0.5s ease-in-out;" />
			{/each}
		{/if}

		<!-- Labels -->
		{#each data as item, i}
			{@const r = radius + 25}
			{@const x = cx + r * Math.cos(angleSlice * i - Math.PI / 2)}
			{@const y = cy + r * Math.sin(angleSlice * i - Math.PI / 2)}
			{@const anchor = x === cx ? 'middle' : x < cx ? 'end' : 'start'}

			<text
				{x}
				{y}
				font-size="10"
				font-family="Inter, sans-serif"
				fill="#6b7280"
				text-anchor={anchor}
				dominant-baseline="middle"
			>
				{item.label}
			</text>
		{/each}
	</svg>
</div>

<style>
	.radar-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}
</style>
