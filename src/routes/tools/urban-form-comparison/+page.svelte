<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import * as turf from '@turf/turf';
	import { DropdownMenu } from "bits-ui";

	import stationRawData from '../../lib/data/transitdata/stations.json';
	import transitRegionsRawData from '../../lib/data/transitdata/transit-regions.json';

    import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Initial stations
	let selectedStation1 = "Markham North (Line 7: Eglinton East LRT)";
	let selectedStation2 = "144 Avenue N (Green Line)";

	// Station area radius in km
	const radiusInKilometers = 0.8;

	// Map configuration
	const mapConfig = {
		style: 'mapbox://styles/canadianurbaninstitute/cmdge4s08000g01s51sgiaaek',
		zoom: 13,
		minZoom: 2,
		// scrollZoom: false,
		// dragPan: false,
		attributionControl: false
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

	// Create line-to-region mapping
	function mapLineToRegion(){
		const lineToRegion = {};

		transitRegionsRawData.forEach(region => {
			region.lines.forEach(line => {
				lineToRegion[line.id] = region.name;
			});
		});

		return lineToRegion;
	}

	// Create station labels, map stations to regions
	function processStationData(stationRawData){
		const lineToRegion = mapLineToRegion();
		
		return stationRawData.map(station => ({
			...station,
			label: `${station.stop_label} (${station.line_display_names})`,
			line_ids_array: station.line_ids 
				? station.line_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) 
				: [],
			region: lineToRegion[station.line_ids?.split(',')[0]?.trim()] || null
		}));
	}

	// Create circle and bounding box for station
	function updateStationData(mapIndex, selectedStation){
		const stationData = stationsProcessed.find(station => station.label === selectedStation);
		const coords = [stationData.longitude, stationData.latitude];
		const circle = turf.circle(coords, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		const bbox = turf.bbox(circle);
		mapData[mapIndex] = { data: stationData, coords, circle, bbox };
	}

	// Create map instances
	function createMap(containerId, centre, maxBounds){
		return new mapboxgl.Map({
			container: containerId,
			...mapConfig,
			centre,
			maxBounds
		});
	}

	// Add layers to map (transit, etc.)
	function addMapLayers(map, allStationData, selectedStationData){

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
					'circle-color': "#FFFFFF",
					'circle-stroke-color': 'black',
					'circle-stroke-width': 2
					}
			});

		// Add station radius source
		map.addSource('station-radius', {
			type: 'geojson',
			data: selectedStationData.circle
		});

		// Add station radius layer
		map.addLayer({
			id: 'station-radius',
			type: 'fill',
			source: 'station-radius',
			paint: {
				'fill-color': 'transparent',
				'fill-opacity': 1.0,
				'fill-outline-color': "red"
			}
		});
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
			console.warn('Map or station data is missing');
			return;
		}

		const { data, circle, bbox, coords } = stationData;

		// Check if map is ready and has required data
		if (!map.isStyleLoaded() || !data || !circle || !map.getLayer(stationLayerId)) {
			return;
		}

		try {
			// Create filter for selected station
			const selectedStationFilter = ['==', ['get', 'station_id'], data.id];

			// Update the radius circle data if source exists
			if (map.getSource(radiusSourceId)) {map.getSource(radiusSourceId).setData(circle);}

			// Update map bounds and center
			if (bbox) {map.setMaxBounds(bbox);} 
			if (coords) {map.setCenter(coords);}

			// Update station styling if callback is provided
			if (updateStylingCallback && typeof updateStylingCallback === 'function') {
				updateStylingCallback(map, selectedStationFilter);
			}

		} catch (error) {
			console.error('Error updating map with station data:', error);
		}
	}

	// Handle layer toggles
	function mapLayerToggle(map, layerVisibilityConfig) {
    // Check if map is ready and all required layers exist
		const requiredLayers = ['greenspace', 'transit-lines-white', 'road-simple', 'parking', 'transit-station-points'];
		
		if (!map || !map.isStyleLoaded()) {
			return false; // Map not ready
		}
		
		// Check if all required layers exist
		const allLayersExist = requiredLayers.every(layerId => map.getLayer(layerId));
		if (!allLayersExist) {
			return false; // Not all layers are loaded yet
		}
		
		// Update individual layer visibility
		map.setLayoutProperty('greenspace', 'visibility', layerVisibilityConfig.greenspace ? 'visible' : 'none');
		map.setLayoutProperty('transit-lines-white', 'visibility', layerVisibilityConfig.transit ? 'visible' : 'none');
		map.setLayoutProperty('parking', 'visibility', layerVisibilityConfig.parking ? 'visible' : 'none');
		map.setLayoutProperty('transit-station-points', 'visibility', layerVisibilityConfig.stations ? 'visible' : 'none');
		
		// Handle road layers (multiple layers with source-layer = 'road')
		const roadLayers = map.getStyle().layers.filter(layer => layer['source-layer'] === 'road'); // Get all layers with source-layer = road
		roadLayers.forEach(layer => {
			map.setLayoutProperty(layer.id, 'visibility', layerVisibilityConfig.roads ? 'visible' : 'none');
		});
		
		return true; // Successfully updated
	}

	// Process station data
	const stationsProcessed = processStationData(stationRawData);

	// List of stations for dropdown
	const stations = stationsProcessed.map(station => station.label);

	// Map 1
	$: if (selectedStation1 && mapData[1]) {
		// Create circle and bounding box
		updateStationData(1, selectedStation1);
		// Update map for selection
		updateMapWithStationData(map1, mapData[1], {
			updateStylingCallback: updateStationStyling
		});
	}

	// Map 2
	$: if (selectedStation2 && mapData[2]) {
		// Create circle and bounding box
		updateStationData(2, selectedStation2);
		// Update map for selection
		updateMapWithStationData(map2, mapData[2], {
			updateStylingCallback: updateStationStyling
		});
	}
	
	// Add layer toggles
	// Map 1
	$: mapLayerToggle(map1, {
		greenspace: greenspaceCheck,
		transit: transitCheck,
		parking: parkingCheck,
		stations: stationCheck,
		roads: roadsCheck
	});
	// Map 2
	$: mapLayerToggle(map2, {
		greenspace: greenspaceCheck,
		transit: transitCheck,
		parking: parkingCheck,
		stations: stationCheck,
		roads: roadsCheck
	});

	onMount(() => {

		// Initialize data
		updateStationData(1, selectedStation1);
		updateStationData(2, selectedStation2);

		greenspaceCheck = true;
		roadsCheck = true;
		transitCheck = true;
		stationCheck = true
		parkingCheck = true;

		// Convert station data to geojson
		const stationGeojson = {
			type: "FeatureCollection",
			features: stationRawData.map(point => ({
				type: "Feature",
				geometry: {
				type: "Point",
				coordinates: [point.longitude, point.latitude]
				},
			properties: {
			name: point.stop_label,
			station_id: point.id
			}
		}))
		};

		// Create first map
		map1 = createMap('map1', [-79.238666491, 43.7937808965], mapData[1].bbox || [[-180, -85], [180, 85]]);
		map2 = createMap('map2', [-114.0624934, 51.0661771], mapData[2].bbox || [[-180, -85], [180, 85]]);

		// Load first map
		map1.on('load', () => {
			// Add layers
			addMapLayers(map1, stationGeojson, mapData[1]);
		});

		// Load second map
		map2.on('load', () => {

			// Add layers
			addMapLayers(map2, stationGeojson, mapData[2]);
		});
		
	});

</script>

<div class="hero">
	<h1>Urban Form Comparison</h1>
	<h2>Mapping Tool</h2>
	<p id="description">
		This tool highlights the urban form of areas within 800m of a transit station. Use the dropdowns to select transit stations to compare.
	</p>
</div>

<div class="map-container">

	<!-- Display first map -->
	<div class="map-column">
		<div id="select1">
			<!-- Station dropdown selection -->
			<select bind:value={selectedStation1}>
				<option disabled selected value={null}>Markham North (Line 7: Eglinton East LRT)</option>
				{#each stations as station}
				<option value={station}>
					{station}
				</option>
				{/each}
			</select>
		</div>
		<div id="map1" />
	</div>
	
	<!-- Display second map -->
	<div class="map-column">
		<div id="select2">
			<!-- Station dropdown selection -->
			<select bind:value={selectedStation2}>
				<option disabled selected value={null}>144 Avenue N (Green Line)</option>
				{#each stations as station}
				<option value={station}>
					{station}
				</option>
				{/each}
			</select>
		</div>
		<div id="map2" />
	</div>

</div>

<div class = "layers">
	<label>
		<input type="checkbox" bind:checked={greenspaceCheck} />
		Greenspace
	</label>
	<label>
		<input type="checkbox" bind:checked={roadsCheck} />
		Road Network
	</label>
	<label>
		<input type="checkbox" bind:checked={transitCheck} />
		Transit Lines
	</label>
	<label>
		<input type="checkbox" bind:checked={stationCheck} />
		Transit Stations
	</label>
	<label>
		<input type="checkbox" bind:checked={parkingCheck} />
		Parking
	</label>
</div>


<style>
	#map1, #map2 {
		width: 450px;
		height: 100%;
		min-height: 450px;
		border-radius: 50%; /* Circular frame */
		overflow: hidden;   /* Clip map to circle */
		border: 2px solid #d3d3d3;
		padding: 20px;
	}

	.map-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		gap: 30px; /* Gap between map columns */
		width: 100%;
		margin: 0 auto;
	}

	/* Place maps side by side */
	.map-column {
		display: flex;
		width: 450px;
		flex-direction: column;
		align-items: center;
		gap: 20px; /* Gap between dropdown and map */
	}

	/* Dropdown container */
	#select1, #select2 {
		width: 300px;
	}

	/* Dropdown style */
	#select1 select, #select2 select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.layers {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 30px;
		margin-bottom: 50px;
		width: 100%;
	}

	.layers label {
		display: flex;
		align-items: center;
		gap: 5px;
		cursor: pointer;
		font-size: 14px;
	}

	.layers input[type="checkbox"] {
		margin: 0;
	}
</style>

