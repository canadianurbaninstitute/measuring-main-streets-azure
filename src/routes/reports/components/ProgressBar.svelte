<script>
	/**
	 * ProgressBar.svelte
	 *
	 * A sticky progress bar fixed to the top of the page.
	 *
	 * Props:
	 *   activeIndex  {number}    — the currently active step (bind from Scroller)
	 *   totalSteps   {number}    — total number of TextBlock steps
	 *   sections     {Section[]} — article sections, each with:
	 *                                firstStepIndex {number} — index of the section's first step
	 *                                label          {string} — display name shown on hover
	 *
	 * The blue fill line grows from 0 → 100% as activeIndex increases.
	 * A circle marker is placed at each section's proportional position along
	 * the bar. Clicking a circle scrolls that [data-step] element into view.
	 */

	export let activeIndex = 0;
	export let totalSteps = 1;
	export let sections = []; // [{ firstStepIndex, label }]

	/**
	 * icon  — 'arrow' | 'dot' | 'custom'
	 * Pass icon="custom" and use the `icon` slot for your own SVG/HTML.
	 */
	export let icon = 'arrow';

	// Progress as a 0–100 percentage
	$: progress = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 0;

	// Which section is currently active (for styling circles)
	$: activeSectionIndex = (() => {
		let idx = 0;
		for (let i = 0; i < sections.length; i++) {
			if (activeIndex >= sections[i].firstStepIndex) idx = i;
		}
		return idx;
	})();

	let hoveredSection = null;

	function scrollToSection(firstStepIndex) {
		const el = document.querySelector(`[data-step="${firstStepIndex}"]`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function circlePercent(firstStepIndex) {
		return totalSteps > 1 ? (firstStepIndex / (totalSteps - 1)) * 100 : 0;
	}
</script>

<nav class="progress-bar" aria-label="Article progress">
	<!-- Track -->
	<div class="track" role="presentation">
		<!-- Blue fill + travelling icon -->
		<div class="fill" style="width: {progress}%" aria-hidden="true">
			<div class="icon-wrap">
				{#if icon === 'arrow'}
					<!-- Simple right-pointing chevron -->
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="12" cy="12" r="10" fill="#2563eb" />
						<path
							d="M10 8l4 4-4 4"
							stroke="#fff"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else if icon === 'dot'}
					<!-- Pulsing filled circle -->
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<circle cx="12" cy="12" r="7" fill="#2563eb" />
						<circle cx="12" cy="12" r="10" fill="#2563eb" opacity="0.25" class="pulse" />
					</svg>
				{:else if icon === 'custom'}
					<slot name="icon" />
				{/if}
			</div>
		</div>

		<!-- Section circles -->
		{#each sections as section, i}
			{@const pct = circlePercent(section.firstStepIndex)}
			{@const isActive = i <= activeSectionIndex}
			{@const isHovered = hoveredSection === i}

			<button
				class="circle"
				class:active={isActive}
				class:hovered={isHovered}
				style="left: {pct}%"
				aria-label="Jump to: {section.label}"
				on:click={() => scrollToSection(section.firstStepIndex)}
				on:mouseenter={() => (hoveredSection = i)}
				on:mouseleave={() => (hoveredSection = null)}
				on:focusin={() => (hoveredSection = i)}
				on:focusout={() => (hoveredSection = null)}
			>
				<!-- Tooltip -->
				{#if isHovered}
					<span class="tooltip" role="tooltip">
						<span class="tooltip-index">
							{String(i + 1).padStart(2, '0')}
						</span>
						{section.label}
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
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: 48px;
		background: #ffffff;
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
		background: #2563eb;
		transition: width 0.3s ease;
		border-radius: 0 1px 1px 0;
		/* overflow visible so the icon can poke above the 2px track */
		overflow: visible;
	}

	/* ── Travelling icon ─────────────────────────────────────── */
	.icon-wrap {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(50%, -50%) translateY(-10px); /* float above the track */
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		filter: drop-shadow(0 1px 3px rgba(37, 99, 235, 0.35));
	}

	.icon-wrap svg {
		width: 100%;
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
		border-color: #2563eb;
		outline: none;
	}

	.circle:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 3px;
	}

	/* Visited / active sections: filled blue */
	.circle.active {
		background: #2563eb;
		border-color: #2563eb;
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

		background: #111;
		color: #fff;
		font-family: 'DM Mono', 'Courier New', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.04em;
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
			border-top-color: #111;
		}
	}

	.tooltip-index {
		color: #2563eb;
		font-weight: 700;
	}
</style>
