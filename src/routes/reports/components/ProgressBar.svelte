<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	// 1. Define Discriminated Union Types for your unique navbar items
	interface AnchorItem {
		type: 'anchor';
		id: string;
		label: string;
	}

	interface StepItem {
		type: 'step';
		stepIndex: number;
		label: string;
		isFirstInSection?: boolean;
	}

	type ProgressItem = AnchorItem | StepItem;

	// 2. Define standard Component Props layout interface
	interface Props {
		items?: ProgressItem[];
		activeStepIndex?: number;
		totalSteps?: number;
		iconType?: 'flame' | 'arrow' | 'dot' | 'custom';
		icon?: Snippet;
	}

	let { items = [], activeStepIndex = 0, iconType = 'flame', icon }: Props = $props();

	// ScrollY updated on every scroll/resize event
	let scrollY = $state(0);

	// 3. Typify numeric coordinates array to prevent 'never[]' mismatch evaluation
	let itemTops = $state<(number | null)[]>([]);

	function measureItems() {
		itemTops = items.map((item) => {
			let el: Element | null = null;
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

		// Dependency tracker invocation
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

	function pctOf(itemIndex: number) {
		return items.length > 1 ? (itemIndex / (items.length - 1)) * 100 : 0;
	}

	function navigateTo(item: ProgressItem) {
		if (item.type === 'anchor') {
			document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			document
				.querySelector(`[data-step="${item.stepIndex}"]`)
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	let hoveredIndex = $state<number | null>(null);

	/**
	 * Svelte action: clamps the tooltip horizontally within the usable viewport.
	 */
	function clampTooltip(node: HTMLElement) {
		node.style.visibility = 'hidden';
		requestAnimationFrame(() => {
			const vw = document.documentElement.clientWidth;
			const pad = 8;
			const tW = node.offsetWidth;

			// The circle button is the direct parent
			const btn = node.parentElement;
			if (!btn) return;
			const btnRect = btn.getBoundingClientRect();
			const cx = btnRect.left + btnRect.width / 2;

			// Where the tooltip's left/right edges would naturally land (centred on cx)
			const naturalLeft = cx - tW / 2;
			const naturalRight = cx + tW / 2;

			if (naturalLeft < pad) {
				node.style.transform = `translateX(calc(-50% + ${pad - naturalLeft}px))`;
			} else if (naturalRight > vw - pad) {
				node.style.transform = `translateX(calc(-50% - ${naturalRight - cx}px))`;
			}

			node.style.visibility = '';
		});
	}
</script>

<nav class="progress-bar" aria-label="Article progress">
	<div class="track" role="presentation">
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

		{#each items as item, i}
			{@const isActive = i <= activeItemIndex}
			{@const isLarge = item.type === 'anchor' || (item.type === 'step' && item.isFirstInSection)}
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
					<span class="tooltip" role="tooltip" use:clampTooltip>
						<span class="tooltip-index">{String(i + 1).padStart(2, '0')}</span>
						<span class="tooltip-label">{item.label}</span>
					</span>
				{/if}
			</button>
		{/each}
	</div>
</nav>

<style>
	.progress-bar {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		z-index: 15;
		height: 48px;
		box-shadow: 0 1px 0 #e8e8e8;
		display: flex;
		align-items: flex-end;
	}
	.track {
		position: relative;
		width: 100%;
		height: 2px;
		background: #e8e8e8;
	}
	.fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--brandLightBlue);
		transition: width 0.3s ease;
		border-radius: 0 1px 1px 0;
		overflow: visible;
	}
	.icon-wrap {
		position: absolute;
		right: 100px;
		top: 50%;
		transform: translate(50%, -50%) translateY(-10px);
		height: 22px;
		width: 213px;
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
		appearance: none;
		-webkit-appearance: none;
		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}
	.circle:hover {
		transform: translate(-50%, -50%) scale(1.5);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
		border-color: var(--brandLightBlue);
		outline: none;
	}
	.circle:focus-visible {
		outline: 2px solid var(--brandLightBlue);
		outline-offset: 3px;
	}
	.circle.active {
		background: var(--brandLightBlue);
		border-color: var(--brandLightBlue);
	}
	.tooltip {
		position: absolute;
		bottom: calc(100% - 38px);
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.5em;
		background: var(--color-slate-50);
		color: var(--color-blue-900);
		text-transform: uppercase;
		font-weight: 700;
		font-size: 0.6rem;
		padding: 0.35em 0.7em;
		border-radius: 3px;
		pointer-events: none;
		z-index: 100;
	}
	.tooltip-index {
		color: var(--brandLightBlue);
		font-weight: 700;
		flex-shrink: 0;
	}
	.tooltip-label {
		font-size: inherit;
		font-weight: 400;
	}
</style>
