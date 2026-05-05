<script>
	import { median } from 'd3-array';
	import { getContext } from 'svelte';

	const { data, x, y, xScale, yScale, width, height } = getContext('LayerCake');

	let props = $props();

	// Set defaults as derived values to maintain reactivity
	const colors = $derived(props.colors || ['#fff1f2', '#f0f9ff', '#f0fdf4', '#fff9eb']);
	const stroke = $derived(props.stroke || '#475569');
	const strokeDasharray = $derived(props.strokeDasharray || '4,4');

	// Calculate statistical medians from the data context if no manual values provided
	const midXValue = $derived.by(() => {
		if (typeof props.xMid === 'number') return props.xMid;
		const val = median($data || [], (d) => d[$x]);
		return typeof val === 'number' ? val : 0;
	});
	const midYValue = $derived.by(() => {
		if (typeof props.yMid === 'number') return props.yMid;
		const val = median($data || [], (d) => d[$y]);
		return typeof val === 'number' ? val : 0;
	});

	// Use scales to map those values to pixels
	const midX = $derived(typeof $xScale === 'function' ? $xScale(midXValue) : 0);
	const midY = $derived(typeof $yScale === 'function' ? $yScale(midYValue) : 0);

	const isValid = $derived(
		midXValue !== 0 && midYValue !== 0 && !isNaN(midX) && !isNaN(midY) && $width > 0
	);

	const labelList = $derived(
		Array.isArray(props.labels)
			? props.labels
			: [
					props.labels?.topLeft,
					props.labels?.topRight,
					props.labels?.bottomLeft,
					props.labels?.bottomRight
				]
	);
</script>

{#if isValid}
	<g class="quadrants-group">
		<!-- Top Left -->
		<rect x="0" y="0" width={midX} height={midY} fill={colors[0]} opacity="0.2" />
		<!-- Top Right -->
		<rect x={midX} y="0" width={$width - midX} height={midY} fill={colors[1]} opacity="0.2" />
		<!-- Bottom Left -->
		<rect x="0" y={midY} width={midX} height={$height - midY} fill={colors[2]} opacity="0.2" />
		<!-- Bottom Right -->
		<rect
			x={midX}
			y={midY}
			width={$width - midX}
			height={$height - midY}
			fill={colors[3]}
			opacity="0.2"
		/>

		<!-- Mid Lines -->
		<line x1="0" y1={midY} x2={$width} y2={midY} {stroke} stroke-width="2" />
		<line x1={midX} y1="0" x2={midX} y2={$height} {stroke} stroke-width="2" />

		{#if labelList.some((l) => l)}
			<text x="12" y="24" class="quadrant-label">{labelList[0] || ''}</text>
			<text x={$width - 12} y="24" class="quadrant-label text-end">{labelList[1] || ''}</text>
			<text x="12" y={$height - 12} class="quadrant-label">{labelList[2] || ''}</text>
			<text x={$width - 12} y={$height - 12} class="quadrant-label text-end"
				>{labelList[3] || ''}</text
			>
		{/if}
	</g>
{/if}

<style>
	.quadrant-label {
		font-size: 10px;
		font-weight: 700;
		fill: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		pointer-events: none;
	}

	.text-end {
		text-anchor: end;
	}
</style>
