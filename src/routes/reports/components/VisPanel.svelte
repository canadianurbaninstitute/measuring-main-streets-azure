<script>
	let { visible = false, label = '', children } = $props();
</script>

<div class="vis-panel" class:visible role="img" aria-label={label}>
	{@render children?.()}

	{#if label}
		<p class="caption">{label}</p>
	{/if}
</div>

<style>
	.vis-panel {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;

		opacity: 0;
		transform: scale(0.97) translateY(6px);
		pointer-events: none;
		transition:
			opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.vis-panel.visible {
		opacity: 1;
		transform: scale(1) translateY(0);
		pointer-events: auto;
	}

	.caption {
		margin: 1.25rem 0 0;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: #999;
		text-align: center;
	}
</style>
