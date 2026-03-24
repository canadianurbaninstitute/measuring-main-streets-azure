<script>
	import { getContext } from 'svelte';
	import { format as d3Format } from 'd3-format';

	const { config } = getContext('LayerCake');

	export let found = {};
	export let e = {};
	export let titleKey = $config.y;
	export let valueKey = $config.x;
	export let xKey = null; // Optional: specify x and y keys for scatter plots
	export let yKey = null;
	export let xLabel = 'X';
	export let yLabel = 'Y';
	export let formatValue = (d) => (isNaN(+d) ? d : d3Format(',.1f')(d) + '%');
	export let offset = -15;

	/**
	 * Optional: pass the seriesConfig array ({ key, label, color }) from StackedBar
	 * to render a multi-row stacked tooltip instead of a single key/value pair.
	 */
	export let seriesConfig = null;

	let tooltipEl;
	let adjustedStyle = '';

	// Re-calculate position whenever the mouse event or found data changes
	$: if (tooltipEl && e) {
		// Use rAF so the element has been painted and has a measurable size
		requestAnimationFrame(() => {
			const container = tooltipEl.offsetParent;
			if (!container) return;

			const cW = container.clientWidth;
			const cH = container.clientHeight;
			const tW = tooltipEl.offsetWidth;
			const tH = tooltipEl.offsetHeight;
			const gap = Math.abs(offset);

			// Default: centred above cursor
			let x = e.layerX - tW / 2;
			let y = e.layerY - tH - gap;

			// Flip below cursor if it would go off the top
			if (y < 0) y = e.layerY + gap;

			// Clamp left/right edges
			if (x < 0) x = 0;
			if (x + tW > cW) x = cW - tW;

			adjustedStyle = `top:${y}px; left:${x}px;`;
		});
	}
</script>

{#if found && e}
	<div class="tooltip" bind:this={tooltipEl} style={adjustedStyle}>
		<div class="tooltip-title">{found[titleKey]}</div>

		{#if seriesConfig}
			{#each seriesConfig as { key, label, color }}
				<div class="tooltip-row">
					<span class="swatch" style="background:{color}"></span>
					<span class="tooltip-key">{label}:</span>
					<span>{formatValue(found[key])}</span>
				</div>
			{/each}
		{:else if xKey && yKey}
			<div class="tooltip-row">
				<span class="tooltip-key">{xLabel}:</span>
				<span>{formatValue(found[xKey])}</span>
			</div>
			<div class="tooltip-row">
				<span class="tooltip-key">{yLabel}:</span>
				<span>{formatValue(found[yKey])}</span>
			</div>
		{:else}
			<div class="tooltip-row">
				<span class="tooltip-key">{valueKey}:</span>
				<span>{formatValue(found[valueKey])}</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.tooltip {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		padding: 8px 10px;
		border-radius: 4px;
		pointer-events: none;
		z-index: 100;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		min-width: 140px;
		font-size: 0.85em;
		white-space: nowrap;
	}

	.tooltip-title {
		font-weight: bold;
		margin-bottom: 6px;
		border-bottom: 1px solid #eee;
		padding-bottom: 4px;
	}

	.tooltip-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 2px 0;
	}

	.swatch {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.tooltip-key {
		color: #555;
		flex: 1;
	}
</style>
