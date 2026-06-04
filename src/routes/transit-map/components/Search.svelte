<script lang="ts">
	import Fuse from 'fuse.js';
	import type { ProcessedStation, Station } from '../../lib/data/transitdata/stations';
	import type { Region, TransitLineWithContext } from '../../lib/data/transitdata/transit-regions';

	interface Props {
		searchTerm: string;
		regionsFuse: Fuse<Region> | undefined;
		linesFuse: Fuse<TransitLineWithContext> | undefined;
		stopsFuse: Fuse<Station> | undefined;
		regionsData: Region[];
		processedStationData: ProcessedStation[];
	}

	let {
		searchTerm = $bindable(''),
		regionsFuse = $bindable(),
		linesFuse = $bindable(),
		stopsFuse = $bindable(),
		regionsData,
		processedStationData
	}: Props = $props();

	function initializeSearchIndexes() {
		const fuseOptions = {
			threshold: 0.3,
			includeScore: true,
			keys: ['name', 'stop_label', 'line_display_name']
		};

		regionsFuse = new Fuse<Region>(regionsData, {
			...fuseOptions,
			keys: ['name']
		});

		const linesWithContext: TransitLineWithContext[] = [];
		regionsData.forEach((region) => {
			region.lines.forEach((line) => {
				linesWithContext.push({
					...line,
					regionName: region.name,
					regionId: region.id
				});
			});
		});

		linesFuse = new Fuse<TransitLineWithContext>(linesWithContext, {
			...fuseOptions,
			keys: ['name', 'regionName']
		});

		stopsFuse = new Fuse<ProcessedStation>(processedStationData, {
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
		margin: 0 1em 0 1em;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 2rem;
		font-size: 0.9em;
	}
</style>
