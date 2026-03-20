<script>
	import { getContext } from 'svelte';
	import { format as d3Format } from 'd3-format';

	const { config } = getContext('LayerCake');

	export let found = {};
	export let e = {};
	export let titleKey = $config.y;
	export let valueKey = $config.x;
	export let formatValue = (d) => (isNaN(+d) ? d : d3Format(',.1f')(d) + '%');
    export let offset = -15;

</script>

{#if found && e}
	<div
		class="tooltip"
		style="top:{e.layerY}px; left:{e.layerX}px; transform: translate(-50%, -100%); margin-top: {offset}px;"
	>
		<div class="tooltip-title">{found[titleKey]}</div>
		<div class="tooltip-row">
			<span class="tooltip-key">{valueKey}:</span>
			{formatValue(found[valueKey])}
		</div>
	</div>
{/if}

<style>
	.tooltip {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		padding: 8px;
		border-radius: 4px;
		pointer-events: none;
		z-index: 100;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		min-width: 120px;
		font-size: 0.9em;
		white-space: nowrap;
	}

	.tooltip-title {
		font-weight: bold;
		margin-bottom: 4px;
		border-bottom: 1px solid #eee;
		padding-bottom: 2px;
	}

	.tooltip-key {
		color: #666;
		text-transform: capitalize;
	}
</style>
