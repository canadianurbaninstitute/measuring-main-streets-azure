<script>
	import QuoteBubble from './QuoteBubble.svelte';

	let {
		quotes = [
			{ text: 'Quote one', author: 'Author one', isDivisive: false },
			{ text: 'Quote two', author: 'Author two', isDivisive: true }
		],
		columns = 1
	} = $props();
</script>

<div class="quote-group" style="--cols: {columns}">
	{#each quotes as quote}
		<QuoteBubble {...quote} />
	{/each}
</div>

<style>
	.quote-group {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 0.5rem;
		width: 100%;
		max-width: 1000px;
		height: 100%;
		margin: 0 auto;
		padding: 1rem;
		overflow-y: auto;
	}

	.quote-group :global(.quote-container) {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.quote-group {
			gap: 0.5rem;
			padding: 0.5rem;
		}
	}
</style>
