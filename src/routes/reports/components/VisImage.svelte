<script>
	/**
	 * VisImage.svelte
	 *
	 * Renders an image inside a visualization panel.
	 * Designed to be used exactly like a chart component — drop it into
	 * the visComponents map via the image helper in +page.svelte.
	 *
	 * Props:
	 *   src     {string}  — image URL or imported asset path (required)
	 *   alt     {string}  — alt text for accessibility (required)
	 *   caption {string}  — optional caption shown below the image
	 *   fit     {string}  — CSS object-fit value: 'contain' | 'cover' (default: 'contain')
	 */

	let { 
		src = '', 
		alt = '', 
		caption = '', 
		fit = 'contain' 
	} = $props();
</script>

<figure class="vis-image">
	<div class="img-wrap">
		<img {src} {alt} style="object-fit: {fit};" />
	</div>

	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.vis-image {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1.5rem;
	}

	.img-wrap {
		flex: 1;
		width: 100%;
		min-height: 0; /* allows flex child to shrink */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	img {
		width: 100%;
		height: 100%;
		max-height: 100%;
		display: block;
		border-radius: 2px;
	}

	figcaption {
		flex-shrink: 0;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		color: #999;
		text-align: center;
		line-height: 1.5;
	}
</style>
