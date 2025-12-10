<script lang="ts">
	let { statusFilters = $bindable(), technologyFilters = $bindable() } = $props();
</script>

<div id="filter-container" class="flex-wrap">
	<div class="filter-group">
		<h6>Status:</h6>
		<label
			><input type="checkbox" bind:group={statusFilters} value="Existing" />
			Existing</label
		>
		<label
			><input type="checkbox" bind:group={statusFilters} value="Construction" /> Construction</label
		>
		<label><input type="checkbox" bind:group={statusFilters} value="Planned" /> Planned</label>
	</div>

	<div class="filter-group">
		<h6>Technology:</h6>
		<label><input type="checkbox" bind:group={technologyFilters} value="Subway" /> Subway</label>
		<label><input type="checkbox" bind:group={technologyFilters} value="LRT" /> LRT</label>
		<label><input type="checkbox" bind:group={technologyFilters} value="Commuter" /> Commuter</label
		>
	</div>
</div>

<style>
	#filter-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
	}

	.filter-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	@media only screen and (min-width: 768px) {
		#filter-container {
			flex-grow: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1em;
		}
	}
</style>
