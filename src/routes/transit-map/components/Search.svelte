<script>
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';

	let {
		searchTerm = $bindable(),
		regionsFuse = $bindable(),
		linesFuse = $bindable(),
		stopsFuse = $bindable(),
		regionsData,
		processedStationData
	} = $props();

	// --- Search Functions ---
	function initializeSearchIndexes() {
		// Configure Fuse.js options for better search
		const fuseOptions = {
			threshold: 0.3,
			includeScore: true,
			keys: ['name', 'stop_label', 'line_display_name']
		};

		// Create search indexes
		regionsFuse = new Fuse(regionsData, {
			...fuseOptions,
			keys: ['name']
		});
		// Create lines search data with region context
		const linesWithContext = [];
		regionsData.forEach((region) => {
			region.lines.forEach((line) => {
				linesWithContext.push({
					...line,
					regionName: region.name,
					regionId: region.id
				});
			});
		});
		linesFuse = new Fuse(linesWithContext, {
			...fuseOptions,
			keys: ['name', 'regionName']
		});

		// Create stops search index
		stopsFuse = new Fuse(processedStationData, {
			...fuseOptions,
			keys: ['stop_label', 'line_display_name']
		});
	}

	$effect(() => {
		if (!regionsData || !processedStationData) return;
		initializeSearchIndexes();
	});
</script>

<input
	id="search"
	type="text"
	bind:value={searchTerm}
	placeholder="Search for a region, line, or station..."
	class="search-input"
/>

<style>
	.search-input {
		margin: 0 1em 0.5em 1em;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
