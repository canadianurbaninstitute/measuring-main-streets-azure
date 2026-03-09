<script>
	import { onMount } from 'svelte';

	export let sectionNumber = '';
	export let reverse = true;

	// charts: array of { label?: string, component, props }
	// Each entry maps 1:1 to a Step child. Scrolling that Step into view activates its chart.
	export let charts = [];

	let sectionEl;
	let activeStep = 0;
	let prevStep = -1;
	let transitioning = false;

	onMount(() => {
		if (!sectionEl) return;

		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const idx = parseInt(entry.target.dataset.chartIndex, 10);
						if (!isNaN(idx) && idx !== activeStep) {
							prevStep = activeStep;
							activeStep = idx;
							transitioning = true;
							setTimeout(() => (transitioning = false), 500);
						}
					}
				});
			},
			{
				threshold: 0,
				rootMargin: `-40% 0px -40% 0px`
			}
		);

		const steps = sectionEl.querySelectorAll('[data-chart-index]');
		steps.forEach((el) => obs.observe(el));

		return () => obs.disconnect();
	});

	$: currentChart = charts[activeStep] ?? charts[0];
	$: prevChart = prevStep >= 0 && transitioning ? charts[prevStep] : null;
</script>

<section class="scroll-section" class:reverse bind:this={sectionEl}>
	<!-- Sticky chart panel -->
	<div class="chart-panel">
		<div class="chart-stage">
			{#if prevChart}
				<div class="chart-layer chart-out" aria-hidden="true">
					{#if prevChart.label}<p class="chart-label">{prevChart.label}</p>{/if}
					<div class="chart-inner">
						<svelte:component this={prevChart.component} {...prevChart.props} />
					</div>
				</div>
			{/if}

			{#if currentChart}
				<div class="chart-layer chart-in" key={activeStep}>
					{#if currentChart.label}<p class="chart-label">{currentChart.label}</p>{/if}
					<div class="chart-inner">
						<svelte:component this={currentChart.component} {...currentChart.props} />
					</div>
				</div>
			{/if}

			{#if charts.length > 1}
				<div class="step-dots" role="presentation">
					{#each charts as _, i}
						<span class="dot" class:active={i === activeStep} />
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Scrolling text column -->
	<div class="text-column">
		{#if sectionNumber}
			<div class="section-number" aria-hidden="true">
				{String(sectionNumber).padStart(2, '0')}
			</div>
		{/if}
		<div class="steps">
			<slot name="steps" {activeStep} />
		</div>
	</div>
</section>

<style>
	.scroll-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: start;
	}

	.scroll-section.reverse {
		direction: rtl;
	}
	.scroll-section.reverse > * {
		direction: ltr;
	}

	/* Sticky chart */
	.chart-panel {
		position: sticky;
		top: 0;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem clamp(1.5rem, 4vw, 4rem);
		border-right: 1px solid var(--color-rule);
	}

	.scroll-section.reverse .chart-panel {
		border-right: none;
		border-left: 1px solid var(--color-rule);
	}

	.chart-stage {
		position: relative;
		width: 100%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chart-layer {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.chart-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin: 0 0 1rem;
		flex-shrink: 0;
	}

	.chart-inner {
		flex: 1;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Crossfade */
	.chart-in {
		animation: fadeUp 0.5s ease forwards;
	}
	.chart-out {
		animation: fadeDown 0.4s ease forwards;
		pointer-events: none;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadeDown {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-14px);
		}
	}

	/* Dots */
	.step-dots {
		position: absolute;
		bottom: -2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 6px;
	}
	.dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-rule);
		transition:
			background 0.3s,
			transform 0.3s;
	}
	.dot.active {
		background: var(--color-accent);
		transform: scale(1.5);
	}

	/* Text column */
	.text-column {
		padding: 0 clamp(1.5rem, 4vw, 4rem);
		display: flex;
		gap: 1.5rem;
	}

	.section-number {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--color-rule);
		writing-mode: vertical-lr;
		align-self: flex-start;
		position: sticky;
		top: 50vh;
		user-select: none;
	}

	.steps {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.scroll-section {
			grid-template-columns: 1fr;
		}
		.chart-panel {
			position: relative;
			height: auto;
			min-height: 280px;
			border-right: none;
			border-bottom: 1px solid var(--color-rule);
		}
		.chart-stage {
			height: 240px;
		}
		.scroll-section.reverse .chart-panel {
			border-left: none;
			border-bottom: 1px solid var(--color-rule);
		}
	}
</style>
