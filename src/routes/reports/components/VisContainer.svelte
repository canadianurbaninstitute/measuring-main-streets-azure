<script lang="ts">
	let { children } = $props();
</script>

<div class="vis-container">
	{@render children?.()}
</div>

<style>
	.vis-container {
		position: relative;
		width: 100%;
		height: 100%;
		/* Subtle card surface */
		background: #ffffff;
		border-radius: 4px;
		overflow: visible;
	}
</style>
