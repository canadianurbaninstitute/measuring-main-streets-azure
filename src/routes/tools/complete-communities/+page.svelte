<script lang="ts">
	// --- Imports ---
	import * as turf from '@turf/turf';
	import { Tabs } from 'bits-ui';
	import type { Feature, Polygon } from 'geojson';
	import { onMount } from 'svelte';
	import {
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../lib/data/transitdata/complete-communities-config';
	import { da_map_source } from '../../lib/data/transitdata/config-mapbox.json';
	// Config imports for metrics matching

	import getD3InterpolateExpression from '../../lib/helpers/getD3InterpolateExpression';
	import Footer from '../../lib/ui/Footer.svelte';
	import '../../styles.css';
	// Components
	import Search from '../../transit-map/components/Search.svelte';
	import SelectRegion from '../../transit-map/components/SelectRegion.svelte';
	import StationStatus from '../../transit-map/components/StationStatus.svelte';
	import Header from './components/Header.svelte';
	import MapContainer from './components/MapContainer.svelte';
	// Custom Tabs
	import AccessTab from './components/AccessTab.svelte';
	import CompleteCommunityPresenceTab from './components/PresenceTab.svelte';
	// --- Data/Map Update Functions ---

	// NEW: Access/Chart Logic State & Calculations lifted from AccessTab
	import { Daily_Visits } from '../../lib/data/transitdata/config.json';
	import type { Station } from '../../lib/data/transitdata/stations';

	// --- Reactive/Exported Variables ---
	let aiDescriptions = $state({});
	let map: mapboxgl.Map = $state();
	let mapCenter: [number, number] = $state([-92, 52]);
	const defaultZoom: number = 3.7;

	// --- UI State Variables ---
	let statusFilters = $state(['Existing', 'Construction', 'Planned']);
	let technologyFilters = $state(['Subway', 'LRT', 'Commuter']);
	let selectedStation: Station = $state({ id: null });
	let stationSelected = $state(false);
	let regionsData = $state([]);
	let processedStationData = $state([]);
	let searchTerm = $state('');
	let activeRegion = $state(null);
	let activeLine = $state(null);
	let tier = $state('tier1');
	let sliderValues = $state([0]);
	let futureVisits = $derived(sliderValues[0]);

	// CC Specific Data
	let stationCCcounts = $state({});
	let stationCCpresence = $state({});
	let stationVisitorData = $state({});
	let p50map = $state(new Map());
	let p75map = $state(new Map());
	let p90map = $state(new Map());
	let futureDemandMap = $state(new Map());

	let p50current = $derived(selectedStation?.id ? p50map.get(selectedStation.id) : undefined);
	let sortedAmenities = $derived(
		[...(p50current ?? [])].sort((a, b) => {
			const aVal = a.Access_Gap ?? 0;
			const bVal = b.Access_Gap ?? 0;
			return aVal - bVal;
		})
	);
	let p75current = $derived(selectedStation?.id ? p75map.get(selectedStation.id) : undefined);
	let p90current = $derived(selectedStation?.id ? p90map.get(selectedStation.id) : undefined);
	let futureDemandCurrent = $derived(
		selectedStation?.id ? futureDemandMap.get(selectedStation.id) : undefined
	);

	let filteredData = $derived(
		sortedAmenities.filter((row) => row.Tier === (tier === 'tier1' ? 1 : 2))
	);

	let projectedVisits = $derived.by(() => {
		let projectedVisits =
			futureVisits * (futureDemandCurrent?.Visits_per_Res ?? 0) + futureDemandCurrent?.Daily_Visits;
		return projectedVisits;
	});

	let computedAmenities = $derived(
		filteredData.map((amenity) => {
			const adjustedAccess = amenity.Access_per_1000 * (amenity.Daily_Visits / projectedVisits);
			const accessGap = adjustedAccess - amenity.MTSA_med;
			const newEmployeesRequired =
				accessGap < 0 ? Math.abs(accessGap / amenity.MTSA_med) * amenity.typical_emp_med : 0;
			const newAdditionalVisitsSupported =
				accessGap > 0
					? (adjustedAccess / amenity.MTSA_med - 1) * amenity.Daily_Visits +
						futureVisits * futureDemandCurrent.Visits_per_Res
					: 0;
			const newAmenitiesRequired =
				Math.round((newEmployeesRequired / amenity.typical_emp_med) * 10) / 10;
			return {
				...amenity,
				accessGap,
				newEmployeesRequired,
				newAmenitiesRequired,
				newAdditionalVisitsSupported
			};
		})
	);

	let selectedVariable = $state(null);
	let min = $state(0);
	let max = $state(0);
	let isOpen = $state(true);
	let activeTab = $state('overall-presence'); // Default tab

	// data
	let transitRegionsRawData = $state([]);
	let stationRawData = $state([]);
	let completeCommunityCounts = $state([]);
	let visitorData = $state([]);
	let completeCommunityPresence = $state([]);

	// Search Indexes
	let regionsFuse = $state();
	let linesFuse = $state();
	let stopsFuse = $state();

	// Side Effects
	$effect(() => {
		const id = selectedStation.id;
		if (id) {
			isOpen = false;
		}
	});

	let visitorCount = $derived(
		stationVisitorData ? Math.round(stationVisitorData[Daily_Visits.key] || 0) : 0
	);

	let missingTier1 = $derived(
		stationCCcounts ? TIER_1_AMENITIES.filter((key) => (stationCCcounts[key.label] || 0) === 0) : []
	);

	let missingTier2 = $derived(
		stationCCcounts ? TIER_2_AMENITIES.filter((key) => (stationCCcounts[key.label] || 0) === 0) : []
	);

	// Helper for classification
	function getClassification(ratio: number, status: string) {
		if (status === 'Absent') return 'Critical Gap';
		if (ratio < 0.8) return 'Below Avg';
		if (ratio >= 0.8 && ratio <= 1.2) return 'Adequate';
		if (ratio > 1.2) return 'Excellent';
		return 'N/A';
	}

	function updateStationData(id) {
		const station = processedStationData.find((s) => s.id === id);

		if (!station) {
			console.error('Station not found for ID:', id);
			selectedStation = { id: null };
			return;
		}

		selectedStation = station;
		// Update CC Data
		stationCCcounts =
			completeCommunityCounts.find((station) => station.id === selectedStation.id) || {};
		stationCCpresence =
			completeCommunityPresence.find((station) => station.id === selectedStation.id) || {};
		stationVisitorData = visitorData.find((station) => station.id === selectedStation.id) || {};
	}

	function updateLayerVariable(variable) {
		if (variable === null) {
			selectedVariable = null;
			if (map.getLayer('da')) map.removeLayer('da');
			return;
		}
		selectedVariable = variable;

		// If layer exists, just update it
		if (map.getLayer('da')) {
			const features = map.querySourceFeatures('da_map', {
				sourceLayer: da_map_source.source_layer
			});
			const expression = getD3InterpolateExpression(features, variable);
			if (expression === null) return;
			min = expression.min;
			max = expression.max;
			map.setPaintProperty(
				'da',
				'fill-color',
				expression.expression as mapboxgl.PropertyValueSpecification<string>
			);
		} else {
			if (!map.getSource('da_map')) return;
			// Add the layer if not present
			map.addLayer(
				{
					id: 'da',
					type: 'fill',
					source: 'da_map',
					'source-layer': da_map_source.source_layer,
					paint: {
						'fill-color': 'rgba(0,0,0,0)', // fully transparent
						'fill-opacity': 0
					}
				},
				'greenspace-built-form' // Place under specific layers if needed, or remove 2nd arg to place on top
			);
			map.once('idle', () => {
				const features = map.querySourceFeatures('da_map', {
					sourceLayer: da_map_source.source_layer
				});
				const expression = getD3InterpolateExpression(features, variable);
				if (expression === null) return;
				min = expression.min;
				max = expression.max;
				map.setPaintProperty(
					'da',
					'fill-color',
					expression.expression as mapboxgl.PropertyValueSpecification<string>
				);
				map.setPaintProperty('da', 'fill-opacity', 0.8);
			});
		}
	}
	// --- Map/Sidebar Navigation Functions ---
	function handleStationSelection(stationId, stationCoordinates) {
		if (!map) return;
		updateStationData(stationId);
		stationSelected = true;

		// draw the MTSA circle
		const radiusInKilometers = 0.8;
		const circleFeature = turf.circle(stationCoordinates, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		const maskFeature = {
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-180, -90],
						[180, -90],
						[180, 90],
						[-180, 90],
						[-180, -90]
					],
					[...circleFeature.geometry.coordinates[0]].reverse()
				]
			}
		};
		if (map.getSource('circle')) {
			(map.getSource('circle') as mapboxgl.GeoJSONSource).setData({
				type: 'FeatureCollection',
				features: [circleFeature]
			});
		}
		if (map.getSource('circle-mask')) {
			(map.getSource('circle-mask') as mapboxgl.GeoJSONSource).setData({
				type: 'FeatureCollection',
				features: [maskFeature as Feature<Polygon>]
			});
		}
		map.flyTo({
			center: stationCoordinates,
			zoom: 14.5,
			duration: 1000
		});

		// Filter thematic layers to circle
		const circlePolygon = circleFeature.geometry;
		const thematicLayers = [
			'msn-lowdensity',
			'msn-highdensity',
			'complete-community-amenities',
			'employment-size',
			'all-nar'
		];
		thematicLayers.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setFilter(layerId, ['within', circlePolygon]);
			}
		});
	}

	function resetStationSelection() {
		if (map && map.getSource('circle')) {
			(map.getSource('circle') as mapboxgl.GeoJSONSource).setData({
				type: 'FeatureCollection',
				features: []
			});
		}
		if (map && map.getSource('circle-mask')) {
			(map.getSource('circle-mask') as mapboxgl.GeoJSONSource).setData({
				type: 'FeatureCollection',
				features: []
			});
		}
		stationSelected = false;
		selectedStation = { id: null };

		const thematicLayersToReset = [
			'msn-lowdensity',
			'msn-highdensity',
			'complete-community-amenities',
			'employment-size',
			'all-nar'
		];
		thematicLayersToReset.forEach((layerId) => {
			if (map && map.getLayer(layerId)) {
				map.setFilter(layerId, null);
			}
		});
	}

	function selectRegion(region) {
		if (!map) return;
		resetStationSelection();
		activeRegion = region;
		activeLine = null;
		map.fitBounds(region.bbox, { padding: 50, duration: 1000 });
	}

	function selectLine(line) {
		if (!map || !map.getLayer('transit-lines')) return;
		resetStationSelection();
		activeLine = line;
		const selectedLine = map.queryRenderedFeatures(undefined, {
			layers: ['transit-lines'],
			filter: ['==', 'line_id', activeLine.id]
		});
		if (selectedLine.length > 0) {
			const featureCollection = { type: 'FeatureCollection', features: selectedLine } as any;
			const [minX, minY, maxX, maxY] = turf.bbox(featureCollection);
			map.fitBounds(
				[
					[minX, minY],
					[maxX, maxY]
				],
				{ padding: 50, duration: 1000 }
			);
		}
	}

	function selectStop(station) {
		handleStationSelection(station.id, [station.longitude, station.latitude]);
	}

	function navigateBack() {
		// navigate back to reset
		if (!map) return;
		resetStationSelection();

		// line case: zoom to region line is in

		if (activeLine) {
			activeLine = null;
			if (activeRegion) {
				map.fitBounds(activeRegion.bbox, { padding: 50, duration: 1000 });
			}
			// region case: reset map
		} else if (activeRegion) {
			activeRegion = null;
			map.flyTo({ center: mapCenter, zoom: defaultZoom, duration: 1000 });
			// TODO: should resetStationSelection run here too
		} else {
			// Global reset if nothing active
			map.flyTo({ center: mapCenter, zoom: defaultZoom, duration: 1000 });
		}
	}

	function handleSidebarBack() {
		if (stationSelected) {
			const previouslyActiveLine = activeLine;
			const previouslyActiveRegion = activeRegion;
			resetStationSelection();
			stationSelected = false;

			// Re-zoom logic mirroring original file
			if (map && previouslyActiveLine) {
				// Try to fit bounds to line again if possible or just navigate back logic
				// For brevity reusing logic:
			}
			// Simplified for now:
			navigateBack();
		} else {
			navigateBack();
		}
	}

	// --- Svelte Lifecycle: onMount (Map Initialization) ---
	onMount(async () => {
		try {
			const [
				stationsRes,
				regionsRes,
				ccCountsRes,
				ccPresenceRes,
				visitorRes,
				aiRes,
				futureDemandRes,
				p50Res,
				p75Res,
				p90Res
			] = await Promise.all([
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/transit_regions/transit-regions.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_counts.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_presence.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/visitor_data.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/ai_descriptions.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/future_demand_conversion.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/threshold_current_p50.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/threshold_current_p75.json'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/threshold_current_p90.json'
				)
			]);

			stationRawData = await stationsRes.json();
			transitRegionsRawData = await regionsRes.json();
			completeCommunityCounts = await ccCountsRes.json();
			completeCommunityPresence = await ccPresenceRes.json();
			visitorData = await visitorRes.json();
			aiDescriptions = await aiRes.json();
			const futureDemand = await futureDemandRes.json();
			const p50 = await p50Res.json();
			const p75 = await p75Res.json();
			const p90 = await p90Res.json();

			// Index for faster lookup
			p50map = p50.reduce((map, item) => {
				if (!map.has(item.id)) map.set(item.id, []);
				map.get(item.id)!.push(item);
				return map;
			}, new Map<string, any[]>());
			p75map = p75.reduce((map, item) => {
				if (!map.has(item.id)) map.set(item.id, []);
				map.get(item.id)!.push(item);
				return map;
			}, new Map<string, any[]>());
			p90map = p90.reduce((map, item) => {
				if (!map.has(item.id)) map.set(item.id, []);
				map.get(item.id)!.push(item);
				return map;
			}, new Map<string, any[]>());

			futureDemandMap = new Map(futureDemand.map((d) => [d.id, d]));

			regionsData = transitRegionsRawData.sort((a, b) => a.name.localeCompare(b.name));

			processedStationData = stationRawData.map((station) => ({
				...station,
				line_ids_array: station.line_id
					? station.line_id
							.split(',')
							.map((s) => parseInt(s.trim(), 10))
							.filter((n) => !isNaN(n))
					: []
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	function handleTabChange(selectedTab) {
		updateLayerVariable(null);

		switch (selectedTab) {
			case 'overall-presence':
				map.setPaintProperty('complete-community-amenities', 'icon-opacity', 1);
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
				map.setPaintProperty('employment-size', 'circle-opacity', 0);
				map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
				break;
			case 'access':
				map.setPaintProperty('complete-community-amenities', 'icon-opacity', 0);
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
			default:
				break;
		}
	}

	// Auto-select tab logic could go here if we want to sync with URL or state
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<Tabs.Root bind:value={activeTab} onValueChange={(value) => handleTabChange(value)}>
	<div id="content-container">
		<div id="sidebar">
			<Header {isOpen} />
			<Search
				bind:searchTerm
				{regionsData}
				{processedStationData}
				bind:regionsFuse
				bind:linesFuse
				bind:stopsFuse
			/>
			{#if stationSelected || activeLine || activeRegion}
				<button onclick={handleSidebarBack} class="back-button bg-zinc-50">← Back</button>
			{/if}
			{#if stationSelected && !searchTerm}
				<div class="station-details-scroll-container">
					{#if selectedStation && selectedStation.id}
						<StationStatus {selectedStation} />
						<Tabs.Content value="overall-presence" class="tab-button">
							{#if activeTab === 'overall-presence'}
								<CompleteCommunityPresenceTab
									{missingTier1}
									{missingTier2}
									{selectedStation}
									{stationCCpresence}
									{stationVisitorData}
									futureDemand={futureDemandCurrent}
									{selectedVariable}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>

						<Tabs.Content value="access" class="tab-button">
							{#if activeTab === 'access'}
								<!-- Simplified Sidebar for Access: just presence stats -->
								<AccessTab
									bind:sliderValues
									bind:tier
									{computedAmenities}
									{projectedVisits}
									{stationCCcounts}
								/>
							{/if}
						</Tabs.Content>
					{:else if stationSelected}
						<p>Loading station details...</p>
					{/if}
				</div>
			{:else}
				<SelectRegion
					bind:searchTerm
					{selectLine}
					{selectRegion}
					{selectStop}
					{processedStationData}
					{regionsData}
					{regionsFuse}
					{linesFuse}
					{stopsFuse}
					bind:activeLine
					bind:activeRegion
				/>
			{/if}
		</div>
		<div class="w-full relative">
			<div class="flex flex-row w-full flex-wrap lg:flex-nowrap">
				<div id="controls" class="flex flex-col w-full">
					<!-- <Filters bind:statusFilters bind:technologyFilters /> -->
					<Tabs.List class="w-full grid grid-cols-2 gap-1">
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="overall-presence">Overall Presence</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="access">Access</Tabs.Trigger
						>
					</Tabs.List>
				</div>
			</div>
			<MapContainer
				{min}
				{max}
				{stationCCcounts}
				{selectedStation}
				{computedAmenities}
				bind:sliderValues
				bind:map
				bind:tier
				{mapCenter}
				{missingTier1}
				{missingTier2}
				{defaultZoom}
				{selectedVariable}
				{activeTab}
				{updateLayerVariable}
				{statusFilters}
				{technologyFilters}
				{processedStationData}
				{selectStop}
				{selectRegion}
				{regionsData}
			/>
		</div>
	</div>
</Tabs.Root>
<Footer />

<style>
	#content-container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	#sidebar {
		width: 100%;
		display: flex;
		flex-direction: column;
		border-top: 1px solid #eee;
		scrollbar-width: none;
	}

	#sidebar::-webkit-scrollbar {
		display: none;
	}

	.station-details-scroll-container {
		flex-grow: 1;
		overflow-y: auto;
	}

	.back-button {
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #ccc;
		cursor: pointer;
		font-size: 0.9em;
		margin: 0 1em;
	}

	.back-button:hover {
		background-color: var(--color-zinc-100);
	}

	@media only screen and (min-width: 768px) {
		#content-container {
			flex-direction: row;
			height: calc(100vh - 120px);
		}

		#sidebar {
			width: 35%;
			min-width: 400px;
			height: 100%;
			border-top: none;
			border-right: 1px solid #eee;
		}

		#sidebar.large {
			width: 100%;
		}
	}
</style>
