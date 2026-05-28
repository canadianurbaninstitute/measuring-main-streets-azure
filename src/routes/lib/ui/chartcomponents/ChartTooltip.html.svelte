<script lang="ts">
	import { format as d3Format } from 'd3-format';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { config } = getContext<{
		config: Readable<{ x: string | string[]; y: string; [key: string]: any }>;
	}>('LayerCake');

	interface TooltipRow {
		key: string;
		label?: string;
		format?: (d: any) => string | number;
	}

	interface SeriesItem {
		key: string;
		label: string;
		color: string;
	}

	interface Props {
		found?: Record<string, any> | null;
		e?: MouseEvent | null;
		titleKey?: string;
		valueKey?: string | string[];
		xKey?: string | null;
		yKey?: string | null;
		xLabel?: string;
		yLabel?: string;
		formatValue?: (d: any) => any;
		offset?: number;
		seriesConfig?: SeriesItem[] | null;
		tooltipRows?: TooltipRow[] | null;
	}

	let {
		found = {},
		e = null,
		titleKey = $config.y,
		valueKey = $config.x,
		xKey = null,
		yKey = null,
		xLabel = 'X',
		yLabel = 'Y',
		formatValue = (d: any) => (isNaN(+d) ? d : d3Format(',.1f')(d) + '%'),
		offset = -15,
		seriesConfig = null,
		tooltipRows = null
	}: Props = $props();

	let tooltipEl = $state<HTMLDivElement | null>(null);
	let adjustedStyle = $state('');

	$effect(() => {
		if (tooltipEl && e) {
			requestAnimationFrame(() => {
				if (!tooltipEl || !e) return;
				const container = tooltipEl.offsetParent as HTMLElement | null;
				if (!container) return;

				const cW = container.clientWidth;
				const tW = tooltipEl.offsetWidth;
				const tH = tooltipEl.offsetHeight;
				const gap = Math.abs(offset);

				let x = e.layerX - tW / 2;
				let y = e.layerY - tH - gap;

				if (y < 0) y = e.layerY + gap;

				if (x < 0) x = 0;
				if (x + tW > cW) x = cW - tW;

				adjustedStyle = `top:${y}px; left:${x}px;`;
			});
		}
	});
</script>

{#if found && e}
	<div class="tooltip" bind:this={tooltipEl} style={adjustedStyle}>
		<div class="tooltip-title">{found[titleKey]}</div>

		{#if tooltipRows}
			{#each tooltipRows as { key, label, format }}
				<div class="tooltip-row">
					<span class="tooltip-key">{label || key}:</span>
					<span>{format ? format(found[key]) : formatValue(found[key])}</span>
				</div>
			{/each}
		{:else if seriesConfig}
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
		{:else if typeof valueKey === 'string'}
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
