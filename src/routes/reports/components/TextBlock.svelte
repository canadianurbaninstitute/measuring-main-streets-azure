<script>
	import { onMount } from 'svelte';

	export let eyebrow = '';
	export let heading = '';

	let el;
	let visible = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.unobserve(el); // fire once
				}
			},
			{ threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div class="text-block" class:visible bind:this={el}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}
	{#if heading}
		<h2 class="heading">{heading}</h2>
	{/if}
	<div class="body">
		<slot />
	</div>
</div>

<style>
	.text-block {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.55s ease,
			transform 0.55s ease;
	}

	.text-block.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.eyebrow {
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin: 0 0 0.6rem;
	}

	.heading {
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--color-ink);
		margin: 0 0 1rem;
	}

	.body {
		font-size: 1rem;
		line-height: 1.75;
		color: color-mix(in srgb, var(--color-ink) 75%, transparent);
	}

	.body :global(p) {
		margin: 0 0 1em;
	}

	.body :global(strong) {
		color: var(--color-ink);
		font-weight: 600;
	}
</style>
