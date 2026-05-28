<script lang="ts">
	import { format } from 'd3-format';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	import QuadTree from './QuadTree.html.svelte';

	const { data, width, height, config } = getContext<{
		data: Readable<any[]>;
		width: Readable<number>;
		height: Readable<number>;
		yScale: Readable<any>;
		config: Readable<{ x: string; [key: string]: any }>;
	}>('LayerCake');

	const commas = format(',');
	const titleCase = (d: string) => d.replace(/\b\w/g, (w) => w.toUpperCase());

	interface Props {
		formatTitle?: (d: any) => any;
		formatValue?: (value: any, key?: string) => any;
		formatKey?: (d: string) => string;
		dataset?: any[] | undefined;
		showTotal?: boolean;
	}

	let {
		formatTitle = (d: any) => d,
		formatValue = (d: any) => (isNaN(+d) ? d : commas(d)),
		formatKey = (d: string) => titleCase(d),
		dataset = undefined,
		showTotal = false
	}: Props = $props();

	const w = 150;
	const w2 = w / 2;

	function sortResult(result: Record<string, any>) {
		if (!result || Object.keys(result).length === 0) return [];

		const internalKeys = [$config.x, '_stack', '_original', '_total'];

		const rows = Object.keys(result)
			.filter((d) => !internalKeys.includes(d))
			.map((key) => {
				const val =
					result._original && typeof result._original[key] !== 'undefined'
						? result._original[key]
						: result[key];
				return {
					key,
					value: val
				};
			})
			.sort((a, b) => b.value - a.value);

		return rows;
	}
</script>

<QuadTree dataset={dataset || $data} y="x">
	{#snippet children({
		x,
		y,
		visible,
		found,
		e
	}: {
		x: number;
		y: number;
		visible: boolean;
		found: any;
		e: MouseEvent | null;
	})}
		{#if visible === true && found}
			{@const foundSorted = sortResult(found)}
			<div style="left:{x}px;" class="line"></div>
			<div
				class="tooltip"
				style="
          width:{w}px;
          display: {visible ? 'block' : 'none'};
          top:{e ? Math.min(Math.max(50, e.layerY), $height - 50) : 0}px;
          left:{Math.min(Math.max(w2, x), $width - w2)}px;"
			>
				<div class="title">{formatTitle(found[$config.x])}</div>
				{#each foundSorted as row}
					<div class="row">
						<span class="key">{formatKey(row.key)}:</span>
						{formatValue(row.value, row.key)}
					</div>
				{/each}

				{#if showTotal && typeof found._total !== 'undefined'}
					<div class="row total-row">
						<span class="key">Net Total:</span>
						{formatValue(found._total)}
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</QuadTree>

<style>
	.tooltip {
		position: absolute;
		font-size: 13px;
		pointer-events: none;
		border: 1px solid #ccc;
		background: rgba(255, 255, 255, 0.95);
		transform: translate(-50%, -50%);
		padding: 8px;
		z-index: 15;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}
	.line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		border-left: 1px dotted #666;
		pointer-events: none;
	}
	.tooltip,
	.line {
		transition:
			left 100ms ease-out,
			top 100ms ease-out;
	}
	.title {
		font-weight: bold;
		margin-bottom: 4px;
		border-bottom: 1px solid #eee;
		padding-bottom: 2px;
	}
	.row {
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}
	.total-row {
		margin-top: 4px;
		padding-top: 4px;
		border-top: 1px solid #eee;
		font-weight: bold;
	}
	.key {
		color: #666;
	}
</style>
