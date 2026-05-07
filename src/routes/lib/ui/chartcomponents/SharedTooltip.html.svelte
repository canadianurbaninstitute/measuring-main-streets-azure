<!--
  @component
  Generates a tooltip that works on multiseries datasets, like multiline charts. It creates a tooltip showing the name of the series and the current value. It finds the nearest data point using the [QuadTree.html.svelte](https://layercake.graphics/components/QuadTree.html.svelte) component.
 -->
<script>
	import { format } from 'd3-format';
	import { getContext } from 'svelte';

	import QuadTree from './QuadTree.html.svelte';

	const { data, width, height, yScale, config } = getContext('LayerCake');

	const commas = format(',');
	const titleCase = (d) => d.replace(/\b\w/g, (w) => w.toUpperCase());

	/** @type {Function} [formatTitle=d => d] - A function to format the tooltip title, which is `$config.x`. */
	export let formatTitle = (d) => d;

	/** @type {Function} [formatValue=d => isNaN(+d) ? d : commas(d)] - A function to format the value. */
	export let formatValue = (d) => (isNaN(+d) ? d : commas(d));

	/** @type {Function} [formatKey=d => titleCase(d)] - A function to format the series name. */
	export let formatKey = (d) => titleCase(d);

	/** @type {Number} [offset=-20] - A y-offset from the hover point, in pixels. */
	export let offset = -20;

	/** @type {Array} [dataset] - The dataset to work off of defaults to $data if left unset. You can pass something custom in here in case you don't want to use the main data or it's in a strange format. */
	export let dataset = undefined;
	export let showTotal = true;

	const w = 150;
	const w2 = w / 2;

	/* --------------------------------------------
	 * Sort the keys by the highest value
	 */
	function sortResult(result) {
		if (!result || Object.keys(result).length === 0) return [];

		// Filter out internal and coordinate keys
		const internalKeys = [$config.x, '_stack', '_original', '_total'];

		const rows = Object.keys(result)
			.filter((d) => !internalKeys.includes(d))
			.map((key) => {
				// Use original value if available (from MultiLineChart's diverging stack)
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

<QuadTree dataset={dataset || $data} y="x" let:x let:y let:visible let:found let:e>
	{#if visible === true && found}
		{@const foundSorted = sortResult(found)}
		<div style="left:{x}px;" class="line"></div>
		<div
			class="tooltip"
			style="
        width:{w}px;
        display: {visible ? 'block' : 'none'};
        /* Use the mouse Y position if available, centered vertically */
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
</QuadTree>

<style>
	.tooltip {
		position: absolute;
		font-size: 13px;
		pointer-events: none;
		border: 1px solid #ccc;
		background: rgba(255, 255, 255, 0.95);
		transform: translate(-50%, -50%); /* Center it vertically on the cursor */
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
