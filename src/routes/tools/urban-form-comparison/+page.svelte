<script lang="ts">
	// Imports
	import * as turf from '@turf/turf';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	// import stationMetrics from '../../lib/data/transitdata/station-metrics.json';
	import Combobox from '../../lib/ui/Combobox.svelte';
	import Footer from '../../lib/ui/Footer.svelte';
	import Checkbox from './Checkbox.svelte';
	import MetricsDisplay from './MetricsDisplay.svelte';

	import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Initial stations
	let selectedStation1 = '573';
	let selectedStation2 = '194';

	let station1Metrics;
	let station2Metrics;

	let station1Data;
	let station2Data;

	// Error messages for user display
	let station1Error = '';
	let station2Error = '';

	// Station area radius in km
	const radiusInKilometers = 0.8;

	// Map configuration
	const mapConfig = {
		style: 'mapbox://styles/canadianurbaninstitute/cmi91fsub003q01qoewrv4s0r',
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
	let greenspaceCheck;
	let roadsCheck;
	let transitCheck;
	let stationCheck;
	let parkingCheck;
	let buildingsCheck;
	let waterCheck;

	// Data variables. Initialize as empty arrays.
	let transitStationsDropdown = [];
	let stationRawData = [];
	let stationMetrics = [];

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
		// Add transit station source
		map.addSource('transit-station-data', {
			type: 'geojson',
			data: allStationData
		});

		// Add station points
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
		to select transit stations to compare.
	</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-fit mx-auto">
	<!-- Display first map -->
	<div class="flex flex-col items-center">
		<div class="w-80 py-2 mx-auto my-auto">
			<!-- Station dropdown selection -->
			<Combobox
				handleSelect={handleStation1Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation1}
			></Combobox>
			<div class="h-4 text-center">
				{#if station1Error}
					<div class="error-message">{station1Error}</div>
				{/if}
			</div>
		</div>
		<div id="map1"></div>
	</div>

	<!-- Display second map -->
	<div class="flex flex-col items-center">
		<div class="w-80 py-2 mx-auto my-auto">
			<!-- Station dropdown selection -->
			<Combobox
				handleSelect={handleStation2Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation2}
			></Combobox>
			<div class="h-4 text-center">
				{#if station2Error}
					<div class="error-message">{station2Error}</div>
				{/if}
			</div>
		</div>
		<div id="map2"></div>
	</div>
</div>

<div class="flex justify-center text-sm px-2 py-4 gap-2 flex-wrap">
	<Checkbox bind:checked={roadsCheck} label="Road Network" icon="mdi:road" />
	<Checkbox
		bind:checked={transitCheck}
		label="Transit Lines"
		icon="mdi:transit-connection-variant"
	/>
	<Checkbox bind:checked={stationCheck} label="Transit Stations" icon="mdi:train" />
	<Checkbox bind:checked={greenspaceCheck} label="Greenspace" icon="mdi:pine-tree-variant" />
	<Checkbox bind:checked={waterCheck} label="Water" icon="mdi:waves" />
	<Checkbox bind:checked={buildingsCheck} label="Buildings" icon="mdi:office-building" />
	<Checkbox bind:checked={parkingCheck} label="Parking" icon="mdi:car" />
</div>

<div class="container mx-auto flex justify-center px-4 sm:px-6 pb-10 max-w-4xl">
	<MetricsDisplay {station1Data} {station2Data} {station1Metrics} {station2Metrics} />
</div>

<Footer />

<style>
	#map1,
	#map2 {
		width: 450px;
		height: 100%;
		min-height: 450px;
		border-radius: 50%; /* Circular frame */
		overflow: hidden; /* Clip map to circle */
		border: 2px solid #d3d3d3;
		padding: 20px;
	}

	.error-message {
		color: #dc2626;
		font-size: 0.875rem;
	}
</style>
