<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		activeIndex?: number;
		threshold?: number;
		text?: Snippet;
		visual?: Snippet;
	}

	let { activeIndex = $bindable(0), threshold = 0.5, text, visual }: Props = $props();

	let steps = $state<Element[]>([]);
	let container = $state<HTMLDivElement>();

	onMount(() => {
		if (!container) return;

		steps = Array.from(container.querySelectorAll('[data-step]'));

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.target instanceof HTMLElement) {
						const idx = Number(entry.target.dataset.step);
						if (!isNaN(idx)) {
							activeIndex = idx;
						}
					}
				});
			},
			{
				root: null,
				rootMargin: `-${Math.round((1 - threshold) * 100)}% 0px -${Math.round(threshold * 100)}% 0px`,
				threshold: 0
			}
		);

		steps.forEach((step) => observer.observe(step));

		return () => observer.disconnect();
	});
</script>

<div class="scroller-layout">
	<div class="text-column" bind:this={container}>
		{@render text?.()}
	</div>

	<div class="visual-column">
		<div class="visual-sticky">
			{@render visual?.()}
		</div>
	</div>
</div>

<style>
	.scroller-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		align-items: start;
	}

	.text-column {
		padding: 0 2rem 0 3rem;
	}

	.visual-column {
		align-self: stretch;
	}

	.visual-sticky {
		position: sticky;
		top: 48px;
		height: calc(100vh - 48px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 3rem 2rem 1rem;
	}

	@media (max-width: 1024px) {
		.scroller-layout {
			display: block;
		}

		.visual-column {
			display: none;
		}

		.text-column {
			padding: 0 1.5rem;
		}
	}
</style>
