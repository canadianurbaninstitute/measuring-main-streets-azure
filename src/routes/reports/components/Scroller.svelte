<script>
	/**
	 * Scroller.svelte
	 *
	 * Core scrollytelling engine. Tracks which text block is in the viewport
	 * and exposes `activeIndex` so the parent can switch visualizations.
	 *
	 * Usage:
	 *   <Scroller bind:activeIndex sections={sections}>
	 *     <div slot="text">   <!-- scrolling text column -->
	 *     <div slot="visual">  <!-- sticky visual column -->
	 *   </Scroller>
	 */

	import { onMount } from 'svelte';

	let { activeIndex = $bindable(0), threshold = 0.5, text, visual } = $props();

	let steps = $state([]);
	let container = $state();

	onMount(() => {
		steps = Array.from(container.querySelectorAll('[data-step]'));

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const idx = Number(entry.target.dataset.step);
						activeIndex = idx;
					}
				});
			},
			{
				root: null,
				// Trigger when the element crosses the middle of the viewport
				rootMargin: `-${Math.round((1 - threshold) * 100)}% 0px -${Math.round(threshold * 100)}% 0px`,
				threshold: 0
			}
		);

		steps.forEach((step) => observer.observe(step));

		return () => observer.disconnect();
	});
</script>

<!--
  Layout: two-column grid.
  Left  → scrolling text (slot "text")
  Right → sticky visual panel (slot "visual")
-->
<div class="scroller-layout">
	<!-- ── Scrolling text column ── -->
	<div class="text-column" bind:this={container}>
		{@render text?.()}
	</div>

	<!-- ── Sticky visual column ── -->
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

	/* ── Text: normal flow so the page scrolls ── */
	.text-column {
		padding: 0 2rem 0 3rem;
	}

	/* ── Visual: sticks while text scrolls past ── */
	.visual-column {
		/* Must have a defined height for sticky to work */
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
