<script>
	// chartIndex: which entry in the parent's charts[] array to show when this step is active.
	// Multiple steps can share the same chartIndex — the chart won't change between them.
	export let chartIndex = 0;

	// activeChartIndex: passed down from ScrollSection via let:activeChartIndex
	export let activeChartIndex = 0;

	$: isActive = activeChartIndex === chartIndex;
</script>

<div class="step" class:active={isActive} data-chart-index={chartIndex}>
	<slot />
</div>

<style>
	.step {
		padding: clamp(3rem, 10vh, 8rem) 0;
		opacity: 0.35;
		transition: opacity 0.4s ease;
	}

	.step:first-child {
		padding-top: clamp(6rem, 15vh, 12rem);
	}
	.step:last-child {
		padding-bottom: clamp(6rem, 15vh, 12rem);
	}

	.step.active {
		opacity: 1;
	}
</style>
