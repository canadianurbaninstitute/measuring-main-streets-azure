<script lang="ts">
	let { title = '', items = [], gradient = null, absolute = true, children = null } = $props();
</script>

<div
	class="legend border max-w-full md:max-w-[275px] px-8 py-10 md:px-2 md:py-2 rounded bg-white shadow-sm text-sm relative md:absolute md:top-2 md:right-2"
>
	{#if title}
		<div class="font-semibold mb-1">{title}</div>
	{/if}

	{#if gradient}
		<div class="flex flex-col items-center gap-2 mb-2">
			<div class="w-full h-4 rounded" style="background: {gradient};"></div>
			<div class="flex justify-between w-full text-xs">
				{#each items as item}
					<span>{item.label} {item.unit}</span>
				{/each}
			</div>
		</div>
	{/if}

	{#each items as item (item.label)}
		{#if item.color}
			<div class="flex items-center gap-2 mb-1">
				<div class="w-4 h-4 rounded" style="background-color: {item.color}"></div>
				<span>{item.label} {item.unit}</span>
			</div>
		{/if}
	{/each}
	{@render children?.()}
</div>

<style>
	.legend {
		display: flex;
		flex-direction: column;
		z-index: 10;
		padding: 0.6em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		margin: 0.15em 0 0.15em 0;
		box-sizing: border-box;
		min-width: 150px;
		justify-content: flex-start;
		cursor: pointer;
		height: min-content;
	}
</style>
