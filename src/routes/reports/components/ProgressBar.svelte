<script>
	/**
	 * ProgressBar.svelte
	 *
	 * A unified sticky progress bar that tracks both pre-scroller page sections
	 * (e.g. <ReportHeader>, <ReportFindings>) and scrollytelling steps.
	 *
	 * ── Props ────────────────────────────────────────────────────────────────
	 *
	 *   items  {Item[]}  — ordered list of ALL navigable sections on the page.
	 *
	 *     Each item is one of two types:
	 *
	 *     Anchor item  — a standalone page section (header, findings, etc.)
	 *       {
	 *         type:      'anchor'
	 *         id:        string   — must match the `id` attribute on the DOM element
	 *         label:     string   — tooltip text
	 *       }
	 *
	 *     Step item  — one step inside the Scroller
	 *       {
	 *         type:          'step'
	 *         stepIndex:     number   — index used on [data-step] attributes
	 *         label:         string   — tooltip text
	 *         isFirstInSection: boolean — true for the first step of each section
	 *                                     (renders a larger circle)
	 *       }
	 *
	 *   activeStepIndex  {number}  — bind from Scroller; drives fill & active state
	 *   totalSteps       {number}  — total TextBlock steps
	 *   icon             {'flame'|'arrow'|'dot'|'custom'}
	 *
	 * ── How progress works ───────────────────────────────────────────────────
	 *
	 *   Items are spread evenly across the 0–100% track by their index.
	 *   Progress fills to the position of the currently active item.
	 *   Anchor items become active when their element enters the viewport
	 *   (tracked via IntersectionObserver). Step items become active via
	 *   activeStepIndex.
	 *
	 * ── Usage in +page.svelte ────────────────────────────────────────────────
	 *
	 *   <ReportHeader id="report-header" />
	 *   <ReportFindings id="report-findings" />
	 *   <Scroller bind:activeIndex> ... </Scroller>
	 *
	 *   <ProgressBar
	 *     activeStepIndex={activeIndex}
	 *     totalSteps={steps.length}
	 *     items={[
	 *       { type: 'anchor', id: 'report-header',   label: 'Introduction' },
	 *       { type: 'anchor', id: 'report-findings', label: 'Key Findings' },
	 *       ...navSections.map((s, i) => ({
	 *         type: 'step',
	 *         stepIndex: s.firstStepIndex,
	 *         label: s.label,
	 *         isFirstInSection: true,
	 *       })),
	 *     ]}
	 *   />
	 */

	import { onMount } from 'svelte';

	let { items = [], activeStepIndex = 0, totalSteps = 1, iconType = 'flame', icon } = $props();

	// scrollY updated on every scroll/resize event
	let scrollY = $state(0);
	// pageHeight = scrollable distance (document height - viewport height)
	let pageHeight = $state(1);
	// Map from item index → element top offset (px from document top)
	let itemTops = $state([]);

	function measureItems() {
		pageHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
		itemTops = items.map((item) => {
			let el = null;
			if (item.type === 'anchor') {
				el = document.getElementById(item.id);
			} else {
				el = document.querySelector(`[data-step="${item.stepIndex}"]`);
			}
			if (!el) return null;
			return el.getBoundingClientRect().top + window.scrollY;
		});
	}

	onMount(() => {
		measureItems();

		const onScroll = () => {
			scrollY = window.scrollY;
		};
		const onResize = () => {
			measureItems();
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});

	// ── Interpolated progress ─────────────────────────────────────────────────
	const progress = $derived.by(() => {
		if (!itemTops.length || items.length < 2) return 0;

		const n = items.length;
		const circlePcts = items.map((_, i) => (i / (n - 1)) * 100);

		// Dependency
		activeStepIndex;

		const scroll = scrollY;
		const firstTop = itemTops[0];
		if (firstTop !== null && scroll <= firstTop) return circlePcts[0];

		const lastTop = itemTops[n - 1];
		if (lastTop !== null && scroll >= lastTop) return circlePcts[n - 1];

		for (let i = 0; i < n - 1; i++) {
			const topA = itemTops[i];
			const topB = itemTops[i + 1];
			if (topA === null || topB === null) continue;
			if (scroll >= topA && scroll < topB) {
				const t = (scroll - topA) / Math.max(1, topB - topA);
				return circlePcts[i] + t * (circlePcts[i + 1] - circlePcts[i]);
			}
		}

		return circlePcts[n - 1];
	});

	// ── Active item index ─────────────────────────
	const activeItemIndex = $derived.by(() => {
		let idx = 0;
		for (let i = 0; i < itemTops.length; i++) {
			const top = itemTops[i];
			if (top !== null && scrollY >= top - window.innerHeight * 0.55) idx = i;
		}
		return idx;
	});

	function pctOf(itemIndex) {
		return items.length > 1 ? (itemIndex / (items.length - 1)) * 100 : 0;
	}

	function navigateTo(item) {
		if (item.type === 'anchor') {
			document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			document
				.querySelector(`[data-step="${item.stepIndex}"]`)
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	let hoveredIndex = $state(null);
</script>

<nav class="progress-bar" aria-label="Article progress">
	<div class="track" role="presentation">
		<!-- Fill + icon -->
		<div class="fill" style="width: {progress}%" aria-hidden="true">
			<div class="icon-wrap">
				{#if iconType === 'flame'}
					<svg viewBox="0 0 24 24" fill="none">
						<path
							d="M12 2C12 2 7 7.5 7 13a5 5 0 0 0 10 0c0-2.5-1.5-4.5-2.5-5.5 0 2-1 3-1 3S12 9 12 2Z"
							fill="#2563eb"
						/>
						<path d="M12 14c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.5 2-4 2-4s2 2.5 2 4Z" fill="#93c5fd" />
					</svg>
				{:else if iconType === 'arrow'}
					<svg viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" fill="#2563eb" />
						<path
							d="M10 8l4 4-4 4"
							stroke="#fff"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else if iconType === 'dot'}
					<svg viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="7" fill="#2563eb" />
						<circle cx="12" cy="12" r="10" fill="#2563eb" opacity="0.25" class="pulse" />
					</svg>
				{:else if iconType === 'custom'}
					{@render icon?.()}
				{/if}
			</div>
		</div>

		<!-- Markers -->
		{#each items as item, i}
			{@const isActive = i <= activeItemIndex}
			{@const isLarge = item.type === 'anchor' || item.isFirstInSection}
			{@const isHovered = hoveredIndex === i}

			<button
				class="circle"
				class:active={isActive}
				class:large={isLarge}
				style="left: {pctOf(i)}%"
				aria-label="Jump to: {item.label}"
				onclick={() => navigateTo(item)}
				onmouseenter={() => (hoveredIndex = i)}
				onmouseleave={() => (hoveredIndex = null)}
				onfocusin={() => (hoveredIndex = i)}
				onfocusout={() => (hoveredIndex = null)}
			>
				{#if isHovered}
					<span class="tooltip" role="tooltip">
						<span class="tooltip-index">{String(i + 1).padStart(2, '0')}</span>
						{item.label}
					</span>
				{/if}
			</button>
		{/each}
	</div>
</nav>

<style>
	/* ── Bar shell ───────────────────────────────────────────── */
	.progress-bar {
		position: fixed;
		top: 30px;
		left: 0;
		right: 0;
		z-index: 10;
		height: 48px;
		box-shadow: 0 1px 0 #e8e8e8;
		display: flex;
		align-items: flex-end; /* pin track to bottom of bar */
	}

	/* ── Track (the thin line at the bottom of the bar) ─────── */
	.track {
		position: relative;
		width: 100%;
		height: 2px;
		background: #e8e8e8;
	}

	/* ── Blue fill ───────────────────────────────────────────── */
	.fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--brandLightBlue);
		transition: width 0.3s ease;
		border-radius: 0 1px 1px 0;
		/* overflow visible so the icon can poke above the 2px track */
		overflow: visible;
	}

	.icon-wrap {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(50%, -50%) translateY(-10px); /* float above the track */
		height: 22px;
		width: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		filter: drop-shadow(0 1px 3px rgba(37, 99, 235, 0.35));
	}

	.icon-wrap :global(svg),
	.icon-wrap :global(img) {
		width: auto;
		height: 100%;
		display: block;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.25;
			transform: scale(1);
		}
		50% {
			opacity: 0.1;
			transform: scale(1.4);
		}
	}

	.icon-wrap :global(.pulse) {
		transform-origin: center;
		animation: pulse 1.8s ease-in-out infinite;
	}

	/* ── Section circles ─────────────────────────────────────── */
	.circle {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);

		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #d1d5db;
		background: #ffffff;
		cursor: pointer;
		padding: 0;

		/* Remove default button styles */
		appearance: none;
		-webkit-appearance: none;

		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.circle:hover,
	.circle.hovered {
		transform: translate(-50%, -50%) scale(1.5);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
		border-color: var(--brandLightBlue);
		outline: none;
	}

	.circle:focus-visible {
		outline: 2px solid var(--brandLightBlue);
		outline-offset: 3px;
	}

	/* Visited / active sections: filled blue */
	.circle.active {
		background: var(--brandLightBlue);
		border-color: var(--brandLightBlue);
	}

	/* ── Tooltip ─────────────────────────────────────────────── */
	.tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;

		display: flex;
		align-items: center;
		gap: 0.5em;

		background: var(--color-slate-50);
		color: #000;
		font-size: 0.68rem;
		padding: 0.35em 0.7em;
		border-radius: 3px;
		pointer-events: none;

		/* Tail */
		&::after {
			content: '';
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			border: 5px solid transparent;
			border-top-color: var(--color-slate-50);
		}
	}

	.tooltip-index {
		color: var(--brandLightBlue);
		font-weight: 700;
	}
</style>
