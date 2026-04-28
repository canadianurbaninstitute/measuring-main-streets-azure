<script lang="ts">
	import collapse from 'svelte-collapse';

	// props
	export let open = false;
	export let duration = 0.2;
	export let easing = 'ease';
	export let onToggle = null;
	export let id = '';

	function handleToggle() {
		// 2. Check if the custom function exists
		if (onToggle) {
			onToggle(); // Call the parent's function
		} else {
			open = !open; // Fallback to default behavior
		}
	}
</script>

<div {id} class="card" class:open aria-expanded={open}>
	<div
		class="card-header"
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && handleToggle()}
		on:click={handleToggle}
	>
		<slot name="header" />
	</div>

	<div class="card-body" use:collapse={{ open, duration, easing }}>
		<slot name="body" />
	</div>
</div>

<style>
	.card-header {
		cursor: pointer;
		user-select: none;
		padding: 0;
		width: 100%;
	}
</style>
