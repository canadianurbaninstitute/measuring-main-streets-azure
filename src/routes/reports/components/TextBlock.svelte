<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../styles.css';

	interface CtaConfig {
		href: string;
		label?: string;
		target?: string;
	}

	interface Props {
		id?: string;
		index?: number;
		active?: boolean;
		eyebrow?: string;
		heading?: string;
		body?: string;
		inlineVisual?: Snippet;
		showInlineVisual?: boolean;
		cta?: CtaConfig;
		children?: Snippet;
	}

	let {
		id = '',
		index = 0,
		active = false,
		eyebrow = '',
		heading = '',
		body = '',
		inlineVisual,
		showInlineVisual = true,
		cta,
		children
	}: Props = $props();
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

	:global(.text-block h3) {
		padding-top: 1.5rem;
	}

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

	.prose :global(blockquote) {
		margin: 1.25em 0;
		padding: 0.1em 0 0.1em 1.1em;
		border-left: 3px solid #ddd;
		color: #666;
		font-style: italic;
	}

	.prose :global(small) {
		font-size: 0.82em;
		color: #888;
		letter-spacing: 0.03em;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid #e8e8e8;
		margin: 1.5em 0;
	}

	.cta-wrap {
		margin-top: 2rem;
		display: flex;
	}

	.inline-visual-wrapper {
		display: none;
	}

	@media (max-width: 1024px) {
		.inline-visual-wrapper {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: fit-content;
			margin-bottom: 2rem;
			background: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			position: relative;
		}

		.inline-visual-wrapper :global(.vis-panel) {
			position: relative;
			opacity: 1 !important;
			visibility: visible !important;
			transform: none !important;
			pointer-events: auto !important;
			width: 100%;
			height: auto;
		}

		.text-block {
			opacity: 1 !important;
			transform: none !important;
			min-height: auto;
			padding: 0rem 0;
		}

		.text-block:first-child {
			padding-top: 0rem;
		}

		.heading {
			padding-top: 2rem;
		}

		.text-block:last-child {
			padding-bottom: 0rem;
		}
	}
</style>
