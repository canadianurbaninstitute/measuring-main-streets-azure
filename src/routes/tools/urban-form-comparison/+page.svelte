<script>
	import * as turf from '@turf/turf';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import Icon from '@iconify/svelte'

	import Combobox from '../../lib/ui/Combobox.svelte';

	import stationRawData from '../../lib/data/transitdata/stations.json';
	import transitStationsDropdown from '../../lib/data/transitdata/transit-stations-dropdown.json';
	import stationMetrics from '../../lib/data/transitdata/station-metrics.json';
	import Footer from '../../lib/ui/Footer.svelte';

	import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Initial stations
	let selectedStation1 = '573';
	let selectedStation2 = '10';

	let station1Metrics; 
	let station2Metrics; 

	let station1Data;
	let station2Data;

	// Station area radius in km
	const radiusInKilometers = 0.8;

	// Map configuration
	const mapConfig = {
		style: 'mapbox://styles/canadianurbaninstitute/cmdge4s08000g01s51sgiaaek',
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

	// Create circle and bounding box for station
	function updateStationData(mapIndex, selectedStationId) {
		const stationData = stationsProcessed.find((station) => station.id === selectedStationId);
		if (!stationData) return;

		const coords = [stationData.longitude, stationData.latitude];
		const circle = turf.circle(coords, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		const bbox = turf.bbox(circle);
		mapData[mapIndex] = { data: stationData, coords, circle, bbox };
	}

	// Handle station selection from combobox
	function handleStation1Select(value) {
		selectedStation1 = value.toString();
	}

	function handleStation2Select(value) {
		selectedStation2 = value.toString();
	}

	// Create map instances
	function createMap(containerId) {
		return new mapboxgl.Map({
			container: containerId,
			...mapConfig
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
	function updateMapWithStationData(map, stationData, options = {}) {
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

		// try {
			// Create filter for selected station
			const selectedStationFilter = ['==', ['get', 'station_id'], data.id];

			// Update the radius circle data if source exists
			if (map.getSource(radiusSourceId)) {
				map.getSource(radiusSourceId).setData(circle);
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
			'transit-lines-white',
			'road-simple',
			'parking',
			'transit-station-points',
			'buildings-ab',
			'water-1'
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
			'transit-lines-white',
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

		// Handle road layers (multiple layers with source-layer = 'road')
		const roadLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'road'); // Get all layers with source-layer = road
		roadLayers.forEach((layer) => {
			map.setLayoutProperty(
				layer.id,
				'visibility',
				layerVisibilityConfig.roads ? 'visible' : 'none'
			);
		});

		// Handle building layers
		const buildingLayers = ['buildings-ab', 'buildings-bc', 'buildings-on', 'buildings-qc'];
		buildingLayers.forEach((layer) => {
			map.setLayoutProperty(
				layer,
				'visibility',
				layerVisibilityConfig.buildings ? 'visible' : 'none'
			);
		});

		// Handle water layers
		const waterLayers = ['water-1', 'waterway-1'];
		waterLayers.forEach((layer) => {
			map.setLayoutProperty(
				layer,
				'visibility',
				layerVisibilityConfig.water ? 'visible' : 'none'
			);
		});


		return true; // Successfully updated
	}

	// Station data
	const stationsProcessed = stationRawData;

	// Map 1
	$: if (selectedStation1 && mapData[1]) {
		// Create circle and bounding box
		updateStationData(1, selectedStation1);
		// Update map for selection
		updateMapWithStationData(map1, mapData[1], {
			updateStylingCallback: updateStationStyling
		});

		station1Metrics = stationMetrics.find(station => station.id === selectedStation1);
		station1Data = stationsProcessed.find(station => station.id === selectedStation1);
	}

	// Map 2
	$: if (selectedStation2 && mapData[2]) {
		// Create circle and bounding box
		updateStationData(2, selectedStation2);
		// Update map for selection
		updateMapWithStationData(map2, mapData[2], {
			updateStylingCallback: updateStationStyling
		});

		station2Metrics = stationMetrics.find(station => station.id === selectedStation2);
		station2Data = stationsProcessed.find(station => station.id === selectedStation2);
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

	onMount(() => {
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
					name: point.stop_label,
					station_id: point.id
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
			map1.setCenter([-75.76952808, 45.35552482]);
			map1.fitBounds(mapData[1].bbox, { padding: 0 });
		});

		// Load second map
		map2.on('load', () => {
			// Add layers
			addMapLayers(map2, stationGeojson, mapData[2]);
			map2.setCenter([-114.0624316, 51.0878946]);
			map2.fitBounds(mapData[2].bbox, { padding: 0 });
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
		</div>
		<div id="map2"></div>
	</div>
</div>

<div class="flex justify-center text-sm px-2 py-4 gap-2 flex-wrap">
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={roadsCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {roadsCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:road" class="mr-1" />
			Road Network
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={transitCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {transitCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:transit-connection-variant" class="mr-1" />
			Transit Lines
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={stationCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {stationCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:train" class="mr-1" />
			Transit Stations
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={greenspaceCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {greenspaceCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:pine-tree-variant" class="mr-1" />
			Greenspace
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={parkingCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {parkingCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:car" class="mr-1" />
			Parking
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={buildingsCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {buildingsCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:office-building" class="mr-1" />
			Buildings
		</div>
	</label>
	
	<label class="cursor-pointer">
		<input type="checkbox" bind:checked={waterCheck} class="sr-only" />
		<div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 {waterCheck ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
			<Icon icon="mdi:waves" class="mr-1" />
			Water
		</div>
	</label>
</div>

<div class="container mx-auto flex justify-center w-4xl pb-10">
	<table class="table-fixed w-full border-l border-r border-gray-200">  
	<thead class="text-base text-gray-700 uppercase border-t border-gray-200">    
		<tr>      
			<th class="w-2/5 px-6 pt-2 bg-gray-50">{station1Data.stop_label}</th>      
			<th class="w-1/5 px-6 pt-2"></th>     
			<th class="w-2/5 px-6 pt-2 bg-gray-50">{station2Data.stop_label}</th>    
		</tr>  
	</thead>  
		<tbody>    
			<tr class="text-xs text-gray-700 text-center uppercase">      
				<td class="px-6 bg-gray-50">{station1Data.line_display_name}</td>      
				<td></td>      
				<td class="px-6 bg-gray-50">{station2Data.line_display_name}</td>    
			</tr>    
			<tr class="text-xs text-gray-700 text-center border-b border-gray-200">      
				<td class="pb-1 text-center bg-gray-50">{station1Data.region}</td>      
				<td></td>      
				<td class="pb-1 text-center bg-gray-50">{station2Data.region}</td>    
			</tr>    
			<tr class="text-sm border-b border-gray-200">     
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.pct_green === undefined}
						N/A
					{:else}
						{station1Metrics.pct_green.toFixed(1)}%
                    {/if}
				</td>      
				<td class="py-1 text-center">% Greenspace</td>      
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.pct_green === undefined}
						N/A
					{:else}
						{station2Metrics.pct_green.toFixed(1)}%
                    {/if}
				</td>    
			</tr>  
			<tr class="text-sm border-b border-gray-200">     
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.pct_parking === undefined}
						N/A
					{:else}
						{station1Metrics.pct_parking.toFixed(1)}%
                    {/if}
				</td>      
				<td class="py-1 text-center">% Parking</td>      
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.pct_parking === undefined}
						N/A
					{:else}
						{station2Metrics.pct_parking.toFixed(1)}%
                    {/if}
				</td>    
			</tr>  
			<tr class="text-sm border-b border-gray-200">     
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.pct_building === undefined}
						N/A
					{:else}
						{station1Metrics.pct_building.toFixed(1)}%
                    {/if}
				</td>      
				<td class="py-1 text-center">% Buildings</td>      
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.pct_building === undefined}
						N/A
					{:else}
						{station2Metrics.pct_building.toFixed(1)}%
                    {/if}
				</td>    
			</tr>  
			<tr class="text-sm border-b border-gray-200">     
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.pct_water === undefined}
						N/A
					{:else}
						{station1Metrics.pct_water.toFixed(1)}%
                    {/if}
				</td>      
				<td class="py-1 text-center">% Water</td>      
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.pct_water === undefined}
						N/A
					{:else}
						{station2Metrics.pct_water.toFixed(1)}%
                    {/if}
				</td>    
			</tr>
		</tbody>
	</table>
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
</style>
