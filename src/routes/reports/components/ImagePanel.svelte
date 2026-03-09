<script>
	export let src = '';
	export let alt = '';
	export let caption = '';

	// Optional: "cover" fills the panel, "contain" shows the full image
	export let fit = 'cover';

	// Optional: focal point for cover mode, e.g. "center", "top", "80% 20%"
	export let position = 'center';
</script>

<figure class="image-panel">
	<div class="image-wrap" style="--fit: {fit}; --position: {position}">
		{#if src}
			<img {src} {alt} />
		{:else}
			<!-- Placeholder shown when no src is provided -->
			<div class="placeholder" aria-label={alt || 'Image placeholder'}>
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
					<rect width="40" height="40" rx="4" fill="currentColor" opacity="0.08" />
					<path d="M8 28l8-8 5 5 5-6 6 9H8z" fill="currentColor" opacity="0.2" />
					<circle cx="26" cy="14" r="3" fill="currentColor" opacity="0.2" />
				</svg>
				{#if alt}<span class="placeholder-label">{alt}</span>{/if}
			</div>
		{/if}
	</div>

	{#if caption}
		<figcaption class="caption">{caption}</figcaption>
	{/if}
</figure>

<style>
	.image-panel {
		width: 100%;
		height: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.image-wrap {
		flex: 1;
		min-height: 0;
		border-radius: 3px;
		overflow: hidden;
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: var(--fit, cover);
		object-position: var(--position, center);
		display: block;
	}

	/* Placeholder */
	.placeholder {
		width: 100%;
		height: 100%;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		color: var(--color-ink);
	}

	.placeholder-label {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.35;
		max-width: 20ch;
		text-align: center;
	}

	/* Caption */
	.caption {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		line-height: 1.5;
		color: color-mix(in srgb, var(--color-ink) 45%, transparent);
		padding-top: 0.25rem;
		border-top: 1px solid var(--color-rule);
	}
</style>
