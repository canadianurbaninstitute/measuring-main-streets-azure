<script>
	/**
	 * +page.svelte  (or App.svelte if not using SvelteKit)
	 *
	 * Wires the scrollytelling pieces together:
	 *   1. Flatten article sections into a linear `steps` array
	 *      so Scroller can track a single activeIndex.
	 *   2. Derive which visId is active from activeIndex.
	 *   3. Render TextBlocks in the text slot, VisPanels in the visual slot.
	 *
	 * To add a new section:
	 *   a) Add an entry to src/lib/data/article.js
	 *   b) Create a visualization component in src/lib/components/vis/
	 *   c) Import it below and add it to the `visComponents` map
	 */

	import Scroller from './components/Scroller.svelte';
	import TextBlock from './components/TextBlock.svelte';
	import VisPanel from './components/VisPanel.svelte';
	import VisContainer from './components/VisContainer.svelte';
	import ProgressBar from './components/ProgressBar.svelte';

	// ── Visualization components ────────────────────────────────────────────
	import ChartTemperature from './components/ChartTemperature.svelte';
	import MapEmissions from './components/MapEmissions.svelte';
	import GridSolutions from './components/GridSolutions.svelte';

	// ── Article data ─────────────────────────────────────────────────────────
	import { sections } from './components/article.js';

	/**
	 * Map visId → Svelte component.
	 * Add new entries here as you build more visualizations.
	 */
	const visComponents = {
		'intro-chart': ChartTemperature,
		'emissions-map': MapEmissions,
		'solutions-grid': GridSolutions
	};

	/**
	 * Flatten sections → steps so Scroller works with a single index.
	 *
	 * Each step carries:
	 *   { visId, eyebrow, heading, body }
	 */
	const steps = sections.flatMap((section) =>
		section.blocks.map((block) => ({ visId: section.visId, ...block }))
	);

	/** Unique ordered list of visIds (preserves first appearance order) */
	const visIds = [...new Map(sections.map((s) => [s.visId, s.visId])).values()];

	// ── Reactive state ───────────────────────────────────────────────────────
	let activeIndex = 0;

	$: activeVisId = steps[activeIndex]?.visId ?? visIds[0];

	/**
	 * Build the sections descriptor for ProgressBar.
	 * Each entry needs the index of its *first* step and a display label.
	 * We derive the label from the first block that has a heading, falling
	 * back to the visId if none is set.
	 */
	const navSections = sections.map((section) => {
		// Find the global step index where this section starts
		const firstStepIndex = steps.findIndex((s) => s.visId === section.visId);
		const label = section.blocks.find((b) => b.heading)?.heading ?? section.visId;
		return { firstStepIndex, label };
	});
</script>

<svelte:head>
	<title>Scrollytelling Template</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Serif+4:ital,wght@0,400;1,400&family=DM+Mono&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- ── Progress bar (fixed, top of page) ─────────────────────────────────── -->
<ProgressBar {activeIndex} totalSteps={steps.length} sections={navSections} />

<!-- ── Article intro ──────────────────────────────────────────────────────── -->
<header class="article-intro">
	<p class="kicker">Interactive Feature</p>
	<h1>A Warming World</h1>
	<p class="deck">
		How rising temperatures, unequal emissions, and the promise of clean energy are reshaping our
		planet — told through data.
	</p>
	<p class="scroll-hint">Scroll to explore ↓</p>
</header>

<!-- ── Scrollytelling body ───────────────────────────────────────────────── -->
<main>
	<Scroller bind:activeIndex threshold={0.5}>
		<!-- ── TEXT SLOT: all TextBlocks in sequence ── -->
		<svelte:fragment slot="text">
			{#each steps as step, i}
				<TextBlock
					index={i}
					active={activeIndex === i}
					eyebrow={step.eyebrow}
					heading={step.heading}
					body={step.body}
				/>
			{/each}
		</svelte:fragment>

		<!-- ── VISUAL SLOT: all panels stacked, only active one visible ── -->
		<svelte:fragment slot="visual">
			<VisContainer>
				{#each visIds as visId}
					<VisPanel visible={activeVisId === visId} label={visId}>
						<!--
              Dynamically render the mapped component.
              Pass any props your visualization needs via spread or named props.
            -->
						<svelte:component this={visComponents[visId]} />
					</VisPanel>
				{/each}
			</VisContainer>
		</svelte:fragment>
	</Scroller>
</main>

<!-- ── Outro / transition out of scrolly ────────────────────────────────── -->
<footer class="article-outro">
	<p>
		Data sources: NASA GISS Surface Temperature Analysis, Global Carbon Project, Project Drawdown.
		Visualization by <em>Your Name</em>.
	</p>
</footer>

<style>
	/* ── Global resets ─────────────────────────────────────────── */
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		background: #ffffff;
		color: #111;
		-webkit-font-smoothing: antialiased;
	}

	/* ── Article intro ─────────────────────────────────────────── */
	.article-intro {
		max-width: 680px;
		margin: 0 auto;
		padding: calc(12vh + 48px) 2rem 8vh;
		text-align: center;
	}

	.kicker {
		font-family: 'DM Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #aaa;
		margin-bottom: 1.2rem;
	}

	h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.4rem, 6vw, 4.5rem);
		font-weight: 700;
		line-height: 1.1;
		color: #111;
		margin-bottom: 1.2rem;
	}

	.deck {
		font-family: 'Source Serif 4', Georgia, serif;
		font-size: clamp(1rem, 2vw, 1.2rem);
		line-height: 1.7;
		color: #444;
		max-width: 52ch;
		margin: 0 auto 2rem;
	}

	.scroll-hint {
		font-family: 'DM Mono', monospace;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: #bbb;
		animation: nudge 2s ease-in-out infinite;
	}

	@keyframes nudge {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(5px);
		}
	}

	/* ── Main scrolly region ───────────────────────────────────── */
	main {
		width: 100%;
	}

	/* ── Outro ─────────────────────────────────────────────────── */
	.article-outro {
		max-width: 680px;
		margin: 0 auto;
		padding: 6rem 2rem 8rem;
		border-top: 1px solid #eee;
		font-family: 'DM Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: #bbb;
		text-align: center;
		line-height: 1.8;
	}
</style>
