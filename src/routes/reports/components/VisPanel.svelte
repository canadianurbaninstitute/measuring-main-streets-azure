<script>
	let { id = '', visible = false, label = '', source = '', children } = $props();
</script>

<figure {id} class="vis-panel" class:visible role="img" aria-label={label}>
	{@render children?.()}

	<figcaption>
		{#if label}
			<p class="caption">{label}</p>
		{/if}
		{#if source}
			<p class="source">Source:{' '}{@html source}</p>
		{/if}
	</figcaption>
</figure>

<style>
	:global(.source > a) {
		color: var(--color-slate-400);
		text-decoration-color: var(--color-slate-400);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
		text-decoration-style: solid;
		transition: all 0.3s ease;
	}

	.vis-panel {
		position: absolute;
		height: 100%;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* padding: 2rem; */
		overflow-x: auto;
		opacity: 0;
		transform: scale(0.97) translateY(6px);
		pointer-events: none;
		transition:
			/* opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), */ transform 0.55s
			cubic-bezier(0.4, 0, 0.2, 1);
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
		color: var(--color-slate-600);
		text-align: left;
		width: 100%;
	}

	.source {
		font-size: 0.5rem;
		letter-spacing: 0.08em;
		color: var(--color-slate-600);
		text-align: left;
		word-break: break-word;
	}

	@media (max-width: 768px) {
		.vis-panel {
			padding: 0rem;
			border: none;
		}

		.caption,
		.source {
			font-size: 0.62rem;
			margin: 0.75rem 0 0;
			line-height: 1.3;
		}
	}
</style>
