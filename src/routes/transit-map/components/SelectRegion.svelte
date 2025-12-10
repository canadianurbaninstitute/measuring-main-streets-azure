<script lang="ts">
	let {
		searchTerm = $bindable(),
		selectRegion,
		selectLine,
		selectStop,
		regionsFuse,
		linesFuse,
		stopsFuse,
		regionsData,
		activeLine = $bindable(),
		activeRegion = $bindable(),
		processedStationData
	} = $props();

	// --- Search/Sidebar Selection Functions ---
	function selectRegionFromSearch(region) {
		searchTerm = '';
		selectRegion(region);
	}

	function selectLineFromSearch(line) {
		searchTerm = '';
		const parentRegion = regionsData.find((r) => r.id === line.regionId);
		if (parentRegion) {
			activeRegion = parentRegion;
		}
		selectLine(line);
	}

	function selectStopFromSearch(stop) {
		searchTerm = '';
		selectStop(stop);
	}

	function performSearch(query) {
		if (!query.trim()) {
			return {
				regions: [],
				lines: [],
				stops: []
			};
		}

		const regions = regionsFuse.search(query).map((result) => ({
			...result.item,
			type: 'region'
		}));

		const lines = linesFuse.search(query).map((result) => ({
			...result.item,
			type: 'line'
		}));

		const stops = stopsFuse.search(query).map((result) => ({
			...result.item,
			type: 'stop'
		}));

		return { regions, lines, stops };
	}

	let searchResults = $derived(
		searchTerm ? performSearch(searchTerm) : { regions: [], lines: [], stops: [] }
	);

	// --- Reactive Logic with Fuse.js search library ---

	let sidebarDisplayItems = $derived.by(() => {
		if (searchTerm) {
			return [];
		} else if (activeLine) {
			return processedStationData
				.filter((s) => s.line_ids_array && s.line_ids_array.includes(activeLine.id))
				.map((s) => ({ ...s, type: 'stop' }))
				.sort((a, b) => (a.stop_label || '').localeCompare(b.stop_label || ''));
		} else if (activeRegion) {
			return activeRegion.lines
				.map((l) => ({ ...l, type: 'line' }))
				.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			return regionsData
				.map((r) => ({ ...r, type: 'region' }))
				.sort((a, b) => a.name.localeCompare(b.name));
		}
	});
</script>

<div class="navigation-scroll-container">
	{#if searchTerm}
		{#if searchResults.regions.length > 0}
			<div class="nav-section-header">Regions</div>
			<ul class="nav-list">
				{#each searchResults.regions as item (item.id)}
					<button onclick={() => selectRegionFromSearch(item)} class="nav-item region-item">
						{item.name}
					</button>
				{/each}
			</ul>
		{/if}
		{#if searchResults.lines.length > 0}
			<div class="nav-section-header">Lines</div>
			<ul class="nav-list">
				{#each searchResults.lines as item (item.id)}
					<button onclick={() => selectLineFromSearch(item)} class="nav-item line-item">
						{item.name} <span class="context">({item.regionName})</span>
					</button>
				{/each}
			</ul>
		{/if}
		{#if searchResults.stops.length > 0}
			<div class="nav-section-header">Stops</div>
			<ul class="nav-list">
				{#each searchResults.stops as item (item.id)}
					<button onclick={() => selectStopFromSearch(item)} class="nav-item stop-item">
						{item.stop_label}
						<span class="context">({item.line_display_name || 'N/A'})</span>
					</button>
				{/each}
			</ul>
		{/if}
		{#if searchResults.regions.length === 0 && searchResults.lines.length === 0 && searchResults.stops.length === 0}
			<p class="no-results">No results found.</p>
		{/if}
	{:else}
		<ul class="nav-list">
			{#each sidebarDisplayItems as item (item.id || item.stop_label)}
				{#if item.type === 'region'}
					<button onclick={() => selectRegion(item)} class="nav-item region-item">
						{item.name}
					</button>
				{:else if item.type === 'line'}
					<button onclick={() => selectLine(item)} class="nav-item line-item">{item.name}</button>
				{:else if item.type === 'stop'}
					<button onclick={() => selectStop(item)} class="nav-item stop-item">
						{item.stop_label}
					</button>
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
	.navigation-scroll-container {
		flex-grow: 1;
		overflow-y: auto;
	}

	.nav-list {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		width: 100%;
		text-align: left;
		padding: 1em;
		cursor: pointer;
		border-bottom: 1px solid #f5f5f5;
		transition: background-color 0.1s;
		font-size: 0.9em;
	}
	.nav-item:last-child {
		border-bottom: none;
	}

	.nav-item:hover {
		background-color: #f0f0f0;
	}

	.region-item {
		font-weight: bold;
		padding-left: 1em;
	}
	.line-item {
		padding-left: 1em;
	}
	.stop-item {
		padding-left: 1em;
	}

	.nav-section-header {
		font-weight: bold;
		margin: 0.8em;
		color: #555;
		font-size: 0.8em;
		text-transform: uppercase;
	}

	.context {
		font-size: 0.9em;
		color: #777;
	}
	.no-results {
		padding: 10px;
		color: #777;
	}
</style>
