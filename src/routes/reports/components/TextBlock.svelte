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

	import '../../styles.css';

	let {
		id = '',
		index = 0,
		active = false,
		eyebrow = '',
		heading = '',
		body = '',
		inlineVisual,
		showInlineVisual = true,
		cta, // { href, label, target }
		children
	} = $props();
</script>

<div {id} class="text-block" class:active data-step={index}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}

	{#if heading}
		<h2 class="heading">{heading}</h2>
	{/if}

	{#if inlineVisual && showInlineVisual}
		<div class="inline-visual-wrapper">
			{@render inlineVisual()}
		</div>
	{/if}

	<!-- Slot takes priority; fall back to the `body` HTML string -->
	<div class="prose">
		{#if children}
			{@render children()}
		{:else if body}
			{@html body}
		{/if}

		{#if cta}
			<a href={cta.href} target={cta.target ?? '_blank'} class="cta-wrap">
				<button class="button-primary flex gap-2 flex-row items-center">
					{cta.label ?? 'Learn More'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14" />
						<path d="m12 5 7 7-7 7" />
					</svg>
				</button>
			</a>
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
		font-size: clamp(0.8rem, 2.5vw, 1rem);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-blue-400);
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
		color: var(--color-slate-900);
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

	/* ── CTA Button ──────────────────────────────────────────── */
	.cta-wrap {
		margin-top: 2rem;
		display: flex;
	}

	.inline-visual-wrapper {
		display: none;
	}

	@media (max-width: 768px) {
		.inline-visual-wrapper {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: fit-content;
			/* min-height: 450px; */
			margin: 2rem 0;
			background: #ffffff;
			border: 1px solid #eee;
			border-radius: 8px;
			overflow: hidden;
			position: relative;
		}

		.text-block {
			opacity: 1 !important; /* On mobile with inline visuals, don't fade out text as much */
			transform: none !important;
			min-height: auto;
			padding: 0rem 0;
		}

		.text-block:first-child {
			padding-top: 2rem;
		}

		.heading {
			padding-top: 2rem;
		}

		.text-block:last-child {
			padding-bottom: 2rem;
		}
	}
</style>
