<script lang="ts">
	// Imports
	import * as turf from '@turf/turf';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import {
		transit_lines_source,
		urban_form_comp_style
	} from '../../lib/data/transitdata/config-mapbox.json';
	// import stationMetrics from '../../lib/data/transitdata/station-metrics.json';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import Checkbox from '../../lib/ui/checkbox/Checkbox.svelte';
	import Combobox from '../../lib/ui/Combobox.svelte';
	import Footer from '../../lib/ui/Footer.svelte';
	// Remove MetricsDisplay since we are integrating into sidebar now
	// import MetricsDisplay from './MetricsDisplay.svelte';
	import { Tabs } from 'bits-ui';
	import DevelopmentPotentialGraphic from './DevelopmentPotentialGraphic.svelte';
	import RadarChart from './RadarChart.svelte';

	import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Initial stations
	let selectedStation1 = '573';
	let selectedStation2 = '194';

	let station1Metrics: any = {};
	let station2Metrics: any = {};

	let station1Data: any;
	let station2Data: any;

	// Convert line colours to Mapbox expression
	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [
			[Number(id)], // Wrap the number in an array
			color
		]),
		'#000000' // Fallback color
	];

	// Error messages for user display
	let station1Error = '';
	let station2Error = '';

	// Station area radius in km
	const radiusInKilometers = 0.8;

	// Map configuration
	const mapConfig = {
		style: urban_form_comp_style.url,
		zoom: 13,
		minZoom: 2,
		scrollZoom: false,
		dragPan: false,
		dragRotate: false,
		attributionControl: false,
		projection: 'mercator'
	};

	// Map data storage
	const mapData = {
		1: { data: {}, coords: [], circle: null, bbox: null },
		2: { data: {}, coords: [], circle: null, bbox: null }
	};

	// For layer toggle
	let greenspaceCheck: boolean;
	let roadsCheck: boolean;
	let transitCheck: boolean;
	let stationCheck: boolean;
	let parkingCheck: boolean;
	let buildingsCheck: boolean;
	let waterCheck: boolean;

	// Data variables. Initialize as empty arrays.
	let transitStationsDropdown: any[] = [];
	let stationRawData: any[] = [];
	let stationMetrics: any[] = [];

	// Bits UI tabs mapping to our mock radar categories
	const radarCategories = [
		{ value: 'land', label: 'Land Availability' },
		{ value: 'growth', label: 'Growth Pressure' },
		{ value: 'permits', label: 'Building Permits' }
	];

	let activeRadarCategory1 = 'land';
	let activeRadarCategory2 = 'land';

	// Mock Data Generator for Radar and Isometric graphics
	function generateMockData(stationId, category = 'land') {
		// Use the integer ID as a stable seed to generate pseudo-random looking data
		const seed = parseInt(stationId) || 123;

		// Shift seed based on category to make tabs look different
		const catShift = category === 'land' ? 1 : category === 'growth' ? 2 : 3;
		const baseValue = ((seed * catShift * 17) % 50) + 20; // range 20-70

		return {
			potentialScore: ((seed * 7) % 10) + 1, // 1-10
			radarPoints: [
				{ label: 'Single Unit Dwellings', value: (baseValue + ((seed * 3) % 40)) % 100 },
				{ label: 'Total Developable Land', value: (baseValue + ((seed * 11) % 40)) % 100 },
				{ label: 'High Opportunity Sites', value: (baseValue + ((seed * 19) % 40)) % 100 },
				{ label: 'Employment Density', value: (baseValue + ((seed * 23) % 40)) % 100 },
				{ label: 'Population Density', value: (baseValue + ((seed * 31) % 40)) % 100 }
			]
		};
	}

	$: mock1 = generateMockData(selectedStation1, activeRadarCategory1);
	$: baseMock1 = generateMockData(selectedStation1, 'land');
	$: mock2 = generateMockData(selectedStation2, activeRadarCategory2);
	$: baseMock2 = generateMockData(selectedStation2, 'land');

	// Create reactive station data from stationRawData.
	$: stationsProcessed = stationRawData || [];

	// Create circle and bounding box for station
	function updateStationData(mapIndex, selectedStationId) {
		const stationData = stationsProcessed.find(
			(station) => station.id.toString() === selectedStationId
		);
		if (!stationData) {
			console.warn(
				`Station with ID "${selectedStationId}" not found in station data for map ${mapIndex}`
			);
			// Set a default empty fallback so that the page does not break
			mapData[mapIndex] = { data: null, coords: [], circle: null, bbox: null };
			return false;
		}
		const coords = [stationData.longitude, stationData.latitude];
		const circle = turf.circle(coords, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		const bbox = turf.bbox(circle);
		mapData[mapIndex] = { data: stationData, coords, circle, bbox };
		return true;
	}

	// Handle station selection from combobox
	function handleStation1Select(value) {
		const newStationId = value.toString();

		const stationExists = stationsProcessed.find((station) => station.id === newStationId);

		if (!stationExists) {
			console.error(`Cannot select station "${newStationId}" for Map 1: Station not found in data`);
			station1Error = 'Station data not available';
			return; // Keep previous valid state
		}

		station1Error = ''; // Clear error on successful selection
		selectedStation1 = newStationId;
	}

	function handleStation2Select(value) {
		const newStationId = value.toString();
		const stationExists = stationsProcessed.find((station) => station.id === newStationId);

		if (!stationExists) {
			console.error(`Cannot select station "${newStationId}" for Map 2: Station not found in data`);
			station2Error = 'Station data not available';
			return; // Keep previous valid state
		}

		station2Error = ''; // Clear error on successful selection
		selectedStation2 = newStationId;
	}

	// Create map instances
	function createMap(containerId) {
		// Ensure the projection value matches the Mapbox typings by casting it to the expected type.
		const cfg = {
			...mapConfig,
			projection: mapConfig.projection as unknown as mapboxgl.Projection
		};

		return new mapboxgl.Map({
			container: containerId,
			...cfg
		});
	}

	// Add layers to map (transit, etc.)
	function addMapLayers(map, allStationData, selectedStationData) {
		// Add transit data sources
		map.addSource('transit-line-data', {
			type: 'vector',
			url: transit_lines_source.url
		});
		map.addSource('transit-station-data', {
			type: 'geojson',
			data: allStationData
		});

		// Add transit data layers
		map.addLayer({
			id: 'transit-lines',
			type: 'line',
			source: 'transit-line-data',
			'source-layer': transit_lines_source.source_layer,
			paint: {
				'line-color': lineColorExpression as mapboxgl.DataDrivenPropertyValueSpecification<string>,
				'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 7, 4, 12, 8],
				'line-dasharray': [
					'case',
					['any', ['==', ['get', 'status'], 'Construction'], ['==', ['get', 'status'], 'Planned']],
					['literal', [1, 2]],
					['literal', [1, 0]]
				]
			}
		});
		map.addLayer({
			id: 'transit-station-points',
			type: 'circle',
			source: 'transit-station-data',
			paint: {
				'circle-radius': 10,
				'circle-color': '#FFFFFF',
				'circle-stroke-color': 'black',
				'circle-stroke-width': 2
			}
		});

		// Add station radius source
		// map.addSource('station-radius', {
		// 	type: 'geojson',
		// 	data: selectedStationData.circle
		// });

		// // Add station radius layer
		// map.addLayer({
		// 	id: 'station-radius',
		// 	type: 'fill',
		// 	source: 'station-radius',
		// 	paint: {
		// 		'fill-color': 'transparent',
		// 		'fill-opacity': 1.0,
		// 		'fill-outline-color': 'red'
		// 	}
		// });
	}

	// Update station styling for selected station
	function updateStationStyling(map, selectedStationFilter) {
		const styleUpdates = [
			['circle-color', ['case', selectedStationFilter, '#FFFFFF', '#B8B8B8']],
			['circle-stroke-color', ['case', selectedStationFilter, '#000000', '#949292']],
			['circle-stroke-width', ['case', selectedStationFilter, 2, 1]]
		];

		styleUpdates.forEach(([property, value]) => {
			map.setPaintProperty('transit-station-points', property, value);
		});
	}

	// Update map for selected station
	function updateMapWithStationData(
		map: mapboxgl.Map | undefined,
		stationData: any,
		options: {
			radiusSourceId?: string;
			stationLayerId?: string;
			updateStylingCallback?: ((map: mapboxgl.Map, selectedStationFilter: any) => void) | null;
		} = {}
	) {
		const {
			radiusSourceId = 'station-radius',
			stationLayerId = 'transit-station-points',
			updateStylingCallback = null
		} = options;

		// Validate inputs
		if (!map || !stationData) {
			return;
		}

		const { data, circle, bbox, coords } = stationData;

		// Check if map is loaded and has required data
		if (!map.isStyleLoaded() || !data || !circle || !map.getLayer(stationLayerId)) {
			return;
		}

		// Create filter for selected station
		const selectedStationFilter = ['==', ['get', 'station_id'], data.id];

		// Update the radius circle data if source exists
		const source = map.getSource(radiusSourceId) as mapboxgl.GeoJSONSource | undefined;
		if (source) {
			// GeoJSONSource doesn't have perfect typings here, so cast to any for setData
			(source as any).setData(circle);
		}

		// Update map bounds and center
		if (bbox && coords) {
			// set bounds AFTER setting center, otherwise the bounds may be off
			map.setCenter(coords);
			map.fitBounds(bbox, { padding: 0 });
		}
		// Update station styling if callback is provided
		if (updateStylingCallback && typeof updateStylingCallback === 'function') {
			updateStylingCallback(map, selectedStationFilter);
		}
	}

	// Handle layer toggles
	function mapLayerToggle(map, layerVisibilityConfig) {
		// Check if map is ready and all required layers exist
		const requiredLayers = [
			'greenspace',
			'transit-lines',
			'road',
			'parking',
			'transit-station-points',
			'all-buildings',
			'water'
		];

		if (!map || !map.isStyleLoaded()) {
			return false; // Map not ready
		}

		// Check if all required layers exist
		const allLayersExist = requiredLayers.every((layerId) => map.getLayer(layerId));
		if (!allLayersExist) {
			return false; // Not all layers are loaded yet
		}

		// Update individual layer visibility
		map.setLayoutProperty(
			'greenspace',
			'visibility',
			layerVisibilityConfig.greenspace ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'transit-lines',
			'visibility',
			layerVisibilityConfig.transit ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'parking',
			'visibility',
			layerVisibilityConfig.parking ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'transit-station-points',
			'visibility',
			layerVisibilityConfig.stations ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'all-buildings',
			'visibility',
			layerVisibilityConfig.buildings ? 'visible' : 'none'
		);

		// Handle road layers (multiple layers with source-layer = 'road')
		const roadLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'road'); // Get all layers with source-layer = road
		roadLayers.forEach((layer) => {
			map.setLayoutProperty(
				layer.id,
				'visibility',
				layerVisibilityConfig.roads ? 'visible' : 'none'
			);
		});

		// Handle water layers
		const waterLayers = ['water', 'waterway'];
		waterLayers.forEach((layer) => {
			map.setLayoutProperty(layer, 'visibility', layerVisibilityConfig.water ? 'visible' : 'none');
		});

		return true; // Successfully updated
	}

	// Station data will be that already loaded
	// const stationsProcessed = stationRawData; // Now handled reactively

	// Map 1
	$: if (selectedStation1 && mapData[1] && stationsProcessed.length > 0) {
		const updateSuccess = updateStationData(1, selectedStation1);
		if (updateSuccess) {
			station1Error = '';
			updateMapWithStationData(map1, mapData[1], {
				updateStylingCallback: updateStationStyling
			});
			station1Metrics = stationMetrics.find(
				(station) => station.id.toString() === selectedStation1
			);
			station1Data = stationsProcessed.find(
				(station) => station.id.toString() === selectedStation1
			);
			if (!station1Metrics) {
				console.warn(`Metrics not found for station "${selectedStation1}" (Map 1)`);
			}
		} else {
			station1Error = 'Station data not available';
		}
	}

	// Map 2
	$: if (selectedStation2 && mapData[2] && stationsProcessed.length > 0) {
		const updateSuccess = updateStationData(2, selectedStation2);
		if (updateSuccess) {
			station2Error = '';
			updateMapWithStationData(map2, mapData[2], {
				updateStylingCallback: updateStationStyling
			});
			station2Metrics = stationMetrics.find(
				(station) => station.id.toString() === selectedStation2
			);
			station2Data = stationsProcessed.find(
				(station) => station.id.toString() === selectedStation2
			);
			if (!station2Metrics) {
				console.warn(`Metrics not found for station "${selectedStation2}" (Map 2)`);
			}
		} else {
			station2Error = 'Station data not available';
		}
	}
	// Add layer toggles
	// Map 1
	$: mapLayerToggle(map1, {
		greenspace: greenspaceCheck,
		transit: transitCheck,
		parking: parkingCheck,
		stations: stationCheck,
		roads: roadsCheck,
		buildings: buildingsCheck,
		water: waterCheck
	});
	// Map 2
	$: mapLayerToggle(map2, {
		greenspace: greenspaceCheck,
		transit: transitCheck,
		parking: parkingCheck,
		stations: stationCheck,
		roads: roadsCheck,
		buildings: buildingsCheck,
		water: waterCheck
	});

	// Validate initial stations
	let initialStationsValidated = false;

	$: if (!initialStationsValidated && stationsProcessed.length > 0) {
		const station1Exists = stationsProcessed.find(
			(station) => station.id.toString() === selectedStation1
		);
		const station2Exists = stationsProcessed.find(
			(station) => station.id.toString() === selectedStation2
		);

		if (!station1Exists) {
			console.error(
				`Initial station "${selectedStation1}" for Map 1 not found in data. Using first available station.`
			);
			selectedStation1 = stationsProcessed[0]?.id.toString() || '1';
		}

		if (!station2Exists) {
			console.error(
				`Initial station "${selectedStation2}" for Map 2 not found in data. Using second available station.`
			);
			selectedStation2 = stationsProcessed[1]?.id.toString() || '2';
		}

		initialStationsValidated = true;
	}

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-stations-dropdown.json'
			);
			transitStationsDropdown = await response.json();
		} catch (error) {
			console.error('Error fetching station dropdown data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			);
			stationRawData = await response.json();
		} catch (error) {
			console.error('Error fetching map station data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			);
			stationMetrics = await response.json();
		} catch (error) {
			console.error('Error fetching built form metric data:', error);
		}

		// Initialize data
		updateStationData(1, selectedStation1);
		updateStationData(2, selectedStation2);

		greenspaceCheck = true;
		roadsCheck = true;
		transitCheck = true;
		stationCheck = true;
		parkingCheck = true;
		buildingsCheck = true;
		waterCheck = true;

		// Convert station data to geojson
		const stationGeojson = {
			type: 'FeatureCollection',
			features: stationRawData.map((point) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [point.longitude, point.latitude]
				},
				properties: {
					name: point?.stop_label ?? null,
					station_id: point?.id ?? null
				}
			}))
		};

		// Create maps
		map1 = createMap('map1');
		map2 = createMap('map2');

		// Load first map
		map1.on('load', () => {
			// Add layers
			addMapLayers(map1, stationGeojson, mapData[1]);
			if (mapData[1].coords && mapData[1].bbox) {
				map1.setCenter(mapData[1].coords);
				map1.fitBounds(mapData[1].bbox, { padding: 0 });
			}
		});

		// Load second map
		map2.on('load', () => {
			// Add layers
			addMapLayers(map2, stationGeojson, mapData[2]);
			if (mapData[2].coords && mapData[2].bbox) {
				map2.setCenter(mapData[2].coords);
				map2.fitBounds(mapData[2].bbox, { padding: 0 });
			}
		});
	});
</script>

<div class="hero">
	<h1>Urban Form Comparison</h1>
	<h2>Mapping Tool</h2>
	<p id="description">
		This tool highlights the urban form of areas within 800m of a transit station. Use the dropdowns
		to select transit stations to compare. Inspired by
		<a href="https://schoolofcities.github.io/rail-transit-and-population-density/" target="_blank"
			><u>School of Cities</u></a
		>.
	</p>
	<p class="text-sm mt-4 text-gray-500">
		<em>This tool is in beta.</em>
	</p>
</div>

<!-- Main Layout Wrapper -->
<div class="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8 px-4 pb-20">
	<!-- LEFT SIDEBAR -->
	<div class="w-full lg:w-[350px] flex-shrink-0 border-r border-gray-200 pr-4 flex flex-col gap-6">
		<h3 class="font-bold text-gray-700 italic">Select stations:</h3>

		<!-- Station 1 Selector -->
		<div class="bg-gray-50 border border-gray-200 p-4 rounded-md">
			<Combobox
				handleSelect={handleStation1Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation1}
			></Combobox>
			{#if station1Error}
				<div class="error-message text-center mt-2">{station1Error}</div>
			{/if}

			{#if station1Data}
				<div class="mt-4 text-center text-sm text-gray-700">
					<div class="font-bold uppercase text-[#1B6CA8] tracking-wider mb-1">
						{station1Data.stop_label}
					</div>
					<div class="text-xs text-gray-500 mb-2">
						Line {station1Data.line_display_name}<br />{station1Data.region}<br
						/>{station1Data.status}
					</div>

					<div class="flex flex-col items-start w-fit mx-auto mt-4 gap-1 text-left">
						<div>
							Greenspace: <span class="font-semibold"
								>{station1Metrics?.greenspace_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Water: <span class="font-semibold"
								>{station1Metrics?.water_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Buildings: <span class="font-semibold"
								>{station1Metrics?.building_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Parking: <span class="font-semibold"
								>{station1Metrics?.parking_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>

						<div class="mt-2 text-[#006A8E] font-medium">
							Development Potential:
							{#if generateMockData(selectedStation1).potentialScore > 6}
								High
							{:else if generateMockData(selectedStation1).potentialScore > 3}
								Med
							{:else}
								Low
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Station 2 Selector -->
		<div class="bg-gray-50 border border-gray-200 p-4 rounded-md">
			<Combobox
				handleSelect={handleStation2Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation2}
			></Combobox>
			{#if station2Error}
				<div class="error-message text-center mt-2">{station2Error}</div>
			{/if}

			{#if station2Data}
				<div class="mt-4 text-center text-sm text-gray-700">
					<div class="font-bold uppercase text-[#1B6CA8] tracking-wider mb-1">
						{station2Data.stop_label}
					</div>
					<div class="text-xs text-gray-500 mb-2">
						Line {station2Data.line_display_name}<br />{station2Data.region}<br
						/>{station2Data.status}
					</div>

					<div class="flex flex-col items-start w-fit mx-auto mt-4 gap-1 text-left">
						<div>
							Greenspace: <span class="font-semibold"
								>{station2Metrics?.greenspace_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Water: <span class="font-semibold"
								>{station2Metrics?.water_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Buildings: <span class="font-semibold"
								>{station2Metrics?.building_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Parking: <span class="font-semibold"
								>{station2Metrics?.parking_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>

						<div class="mt-2 text-[#006A8E] font-medium">
							Development Potential:
							{#if generateMockData(selectedStation2).potentialScore > 6}
								High
							{:else if generateMockData(selectedStation2).potentialScore > 3}
								Med
							{:else}
								Low
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Map Layer Toggles -->
		<div class="mt-4">
			<div class="grid grid-cols-2 gap-x-2 gap-y-4 text-xs">
				<div class="flex flex-col gap-2 border-r border-gray-200 pr-2">
					<div class="font-bold text-gray-500 mb-1">Transit & Roads</div>
					<Checkbox
						bind:checked={transitCheck}
						label="Transit Lines"
						icon="mdi:transit-connection-variant"
					/>
					<Checkbox bind:checked={stationCheck} label="Transit Stations" icon="mdi:train" />
					<Checkbox bind:checked={roadsCheck} label="Road Network" icon="mdi:road" />
				</div>
				<div class="flex flex-col gap-2 pl-2">
					<div class="font-bold text-gray-500 mb-1">Built Form</div>
					<Checkbox
						bind:checked={greenspaceCheck}
						label="Greenspace"
						icon="mdi:pine-tree-variant"
					/>
					<Checkbox bind:checked={waterCheck} label="Water" icon="mdi:waves" />
					<Checkbox bind:checked={buildingsCheck} label="Buildings" icon="mdi:office-building" />
					<Checkbox bind:checked={parkingCheck} label="Parking" icon="mdi:car" />
				</div>
			</div>
		</div>
	</div>

	<!-- RIGHT MAIN CONTENT (The Data Viz Grid) -->
	<div class="flex-grow flex flex-col gap-12 pt-4">
		<!-- Column Headers -->
		<div
			class="hidden md:grid grid-cols-3 gap-6 text-center text-[#4B7992] uppercase tracking-wider font-semibold text-sm"
		>
			<div>Built Form</div>
			<div class="flex flex-col items-center">
				<span>Station Ranking</span>
			</div>
			<div>Development Potential</div>
		</div>

		<!-- ROW 1: STATION 1 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
			<!-- Map 1 -->
			<div class="flex justify-center relative">
				<!-- In mobile view, show label -->
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Built Form
				</div>
				<div id="map1" class="map-circle drop-shadow-lg"></div>
			</div>

			<!-- Radar 1 -->
			<div class="flex flex-col items-center relative">
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Station Ranking
				</div>

				<Tabs.Root
					bind:value={activeRadarCategory1}
					class="w-full flex justify-center mb-4 text-xs"
				>
					<Tabs.List
						class="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>

				<RadarChart data={mock1.radarPoints} size={250} max={100} color="#ff007f" />
			</div>

			<!-- Dev Potential 1 -->
			<div class="flex justify-center relative">
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Development Potential
				</div>
				<DevelopmentPotentialGraphic score={baseMock1.potentialScore} maxScore={10} />
			</div>
		</div>

		<!-- Divider -->
		<div class="w-full h-px bg-gray-200 hidden md:block"></div>

		<!-- ROW 2: STATION 2 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
			<!-- Map 2 -->
			<div class="flex justify-center">
				<div id="map2" class="map-circle drop-shadow-lg"></div>
			</div>

			<!-- Radar 2 -->
			<div class="flex flex-col items-center">
				<Tabs.Root
					bind:value={activeRadarCategory2}
					class="w-full flex justify-center mb-4 text-xs"
				>
					<Tabs.List
						class="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>

				<RadarChart data={mock2.radarPoints} size={250} max={100} color="#ff007f" />
			</div>

			<!-- Dev Potential 2 -->
			<div class="flex justify-center">
				<DevelopmentPotentialGraphic score={baseMock2.potentialScore} maxScore={10} />
			</div>
		</div>
	</div>
</div>

<Footer />

<style>
	.map-circle {
		width: 300px;
		height: 300px;
		min-height: 300px;
		border-radius: 50%; /* Circular frame */
		overflow: hidden; /* Clip map to circle */
		border: 1px solid #e5e7eb;
	}

	.error-message {
		color: #dc2626;
		font-size: 0.875rem;
	}
</style>
