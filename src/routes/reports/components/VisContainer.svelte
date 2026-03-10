<script>
	/**
	 * VisContainer.svelte
	 *
	 * A simple wrapper that stacks all VisPanel children on top of
	 * each other (position: relative / absolute) so they can crossfade.
	 *
	 * Usage:
	 *   <VisContainer>
	 *     <VisPanel visible={activeVis === 0}>...</VisPanel>
	 *     <VisPanel visible={activeVis === 1}>...</VisPanel>
	 *   </VisContainer>
	 */
</script>

<div class="vis-container">
	<slot />
</div>

<style>
	.vis-container {
		position: relative;
		width: 100%;
		height: 100%;
		/* Subtle card surface */
		background: #ffffff;
		border-radius: 4px;
		overflow: hidden;
	}
</style>
