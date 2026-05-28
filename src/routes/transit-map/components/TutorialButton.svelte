<script lang="ts">
	let { initiateTutorial } = $props();
</script>

<button
	id="transit-tutorial"
	aria-label="Show tutorial"
	type="button"
	onclick={initiateTutorial}
	style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;"
>
	<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"
		><circle cx="12" cy="12" r="12" fill="#0098D6" /><text
			x="12"
			y="17"
			text-anchor="middle"
			font-size="16"
			fill="#fff"
			font-family="Arial"
			font-weight="bold">?</text
		></svg
	>
</button>
