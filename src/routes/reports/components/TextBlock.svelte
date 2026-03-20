<script>
	/**
	 * TextBlock.svelte
	 *
	 * A single "step" in the scrollytelling narrative.
	 * Renders a text card and exposes a `data-step` attribute so
	 * Scroller's IntersectionObserver can track it.
	 *
	 * Props:
	 *   index       {number}  — position in the steps array (required)
	 *   active      {boolean} — whether this block is currently in view
	 *   eyebrow     {string}  — small label above the heading (optional)
	 *   heading     {string}  — section heading (optional)
	 *   body        {string}  — HTML string for the body content (optional)
	 *
	 * The `body` prop accepts arbitrary HTML so you can use:
	 *   <p>, <strong>, <em>, <a>, <ul>/<ol>/<li>, <blockquote>, <small>, etc.
	 *
	 * Alternatively, leave `body` empty and use the default slot for full
	 * Svelte component flexibility:
	 *   <TextBlock index={2} active={...}>
	 *     <p>Some text with a <strong>bold word</strong>.</p>
	 *     <ul><li>Item one</li></ul>
	 *   </TextBlock>
	 *
	 * ⚠️  Only pass trusted/sanitised content to `body` — {@html} is not
	 *     XSS-safe for arbitrary user input.
	 */

	let { 
		index = 0, 
		active = false, 
		eyebrow = '', 
		heading = '', 
		body = '', 
		children 
	} = $props();
</script>

<div class="text-block" class:active data-step={index}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}

	{#if heading}
		<h2 class="heading">{heading}</h2>
	{/if}

	<!-- Slot takes priority; fall back to the `body` HTML string -->
	<div class="prose">
		{#if children}
			{@render children()}
		{:else if body}
			{@html body}
		{/if}
	</div>
</div>

<style>
	.text-block {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 3rem 0;
		opacity: 0.35;
		transform: translateY(8px);
		transition:
			opacity 0.45s ease,
			transform 0.45s ease;
	}

	.text-block.active {
		opacity: 1;
		transform: translateY(0);
	}

	.text-block:first-child {
		padding-top: 40vh;
	}
	.text-block:last-child {
		padding-bottom: 40vh;
	}

	/* ── Meta labels ─────────────────────────────────────────── */
	.eyebrow {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #888;
		margin: 0 0 0.6rem;
	}

	.heading {
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 700;
		margin: 0 0 1rem;
		line-height: 1.25;
	}

	/* ── Prose container ─────────────────────────────────────── */
	.prose {
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		color: #333;
		line-height: 1.75;
		max-width: 46ch;
	}

	/* Paragraphs */
	.prose :global(p) {
		margin: 0 0 1em;
	}
	.prose :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Inline emphasis */
	.prose :global(strong) {
		font-weight: 700;
		color: #111;
	}
	.prose :global(em) {
		font-style: italic;
	}

	/* Links */
	.prose :global(a) {
		color: #111;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		transition: color 0.2s;
	}
	.prose :global(a:hover) {
		color: #555;
	}

	/* Lists */
	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1em 1.4em;
		padding: 0;
	}
	.prose :global(li) {
		margin-bottom: 0.35em;
	}
	.prose :global(li:last-child) {
		margin-bottom: 0;
	}

	/* Blockquote */
	.prose :global(blockquote) {
		margin: 1.25em 0;
		padding: 0.1em 0 0.1em 1.1em;
		border-left: 3px solid #ddd;
		color: #666;
		font-style: italic;
	}

	/* Small / captions */
	.prose :global(small) {
		font-size: 0.82em;
		color: #888;
		letter-spacing: 0.03em;
	}

	/* Horizontal rule */
	.prose :global(hr) {
		border: none;
		border-top: 1px solid #e8e8e8;
		margin: 1.5em 0;
	}
</style>
