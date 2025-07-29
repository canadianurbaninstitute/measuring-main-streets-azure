<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import * as turf from '@turf/turf';

	import stationRawData from '../../lib/data/stations.json';
	import transitRegionsRawData from '../../lib/data/transit-regions.json';

    import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Map data storage
	const mapData = {
		1: { data: {}, coords: [], circle: null, bbox: null },
		2: { data: {}, coords: [], circle: null, bbox: null }
	};

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
		attributionControl: false
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
	};

	// Create station labels, map stations to regions
	function processStationData(){
		const lineToRegion = mapLineToRegion();
		
		return stationRawData.map(station => ({
			...station,
			label: `${station.stop_label} (${station.line_display_names})`,
			line_ids_array: station.line_ids 
				? station.line_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) 
				: [],
			region: lineToRegion[station.line_ids?.split(',')[0]?.trim()] || null
		}));
	};

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
	};

	// Create map instances
	function createMap(containerId, centre, maxBounds){
		return new mapboxgl.Map({
			container: containerId,
			...mapConfig,
			centre,
			maxBounds
		});
	};

	// TO IMPLEMENT: Add layers to map
	function addMapLayers(map){

	};

	// TO IMPLEMENT: flyto, setcentre, change transit point styling.
	function updateMapForStation(map){

	};

	// Process station data
	const stationsProcessed = processStationData();

	// List of stations for dropdown
	const stations = stationsProcessed.map(station => station.label);

	// Create circle and bounding box for first station
	$: if (selectedStation1) {
		updateStationData(1, selectedStation1);
	}

	// Create circle and bounding box for second station
	$: if (selectedStation2) {
		updateStationData(2, selectedStation2);
	}

	// Update map bounds, center, and style based on selection
	$: if (map1 && selectedStation1 && mapData[1].data && mapData[1].circle && map1.isStyleLoaded() && map1.getLayer('transit-station-points')) {

		const selectedStationFilter = ['==', ['get', 'station_id'], mapData[1].data.id];

		// Check if the source exists before trying to update it
		if (map1.getSource('station-radius')) {
			// Update the radius circle data
			map1.getSource('station-radius').setData(mapData[1].circle);
		}
		
		// Update map bounds and center
		map1.setMaxBounds(mapData[1].bbox);
		map1.setCenter(mapData[1].coords);
	
		// Update the paint properties to conditionally color stations
		map1.setPaintProperty('transit-station-points', 'circle-color', [
			'case',
			selectedStationFilter,
			'#FFFFFF', // Selected station
			'#B8B8B8'  // Non-selected stations
		]);

		map1.setPaintProperty('transit-station-points', 'circle-stroke-color', [
			'case',
			selectedStationFilter,
			'#000000', // Selected station
			'#949292'  // Non-selected stations
		]);

		map1.setPaintProperty('transit-station-points', 'circle-stroke-width', [
			'case',
			selectedStationFilter,
			2, // Selected station
			1  // Non-selected stations
		]);
	}

	// Update map bounds, center, and style based on selection
	$: if (map2 && selectedStation2 && mapData[2].data && mapData[2].circle && map2.isStyleLoaded() && map2.getLayer('transit-station-points')) {

		const selectedStationFilter = ['==', ['get', 'station_id'], mapData[2].data.id];

		// Check if the source exists before trying to update it
		if (map2.getSource('station-radius')) {
			// Update the radius circle data
			map2.getSource('station-radius').setData(mapData[2].circle);
		}
		
		// Update map bounds and center
		map2.setMaxBounds(mapData[2].bbox);
		map2.setCenter(mapData[2].coords);

		map2.setPaintProperty('transit-station-points', 'circle-color', [
			'case',
			selectedStationFilter,
			'#FFFFFF', // Selected station
			'#B8B8B8'  // Non-selected stations
		]);

		map2.setPaintProperty('transit-station-points', 'circle-stroke-color', [
			'case',
			selectedStationFilter,
			'#000000', // Selected station
			'#949292'  // Non-selected stations
		]);

		map2.setPaintProperty('transit-station-points', 'circle-stroke-width', [
			'case',
			selectedStationFilter,
			2, // Selected station
			1  // Non-selected stations
		]);
	}

	// Layer visibility toggles
	$: if (map1 && map1.isStyleLoaded() && map1.getLayer('greenspace') && map1.getLayer('transit-lines-white') && map1.getLayer('road-simple') && map1.getLayer('parking')) {
		map1.setLayoutProperty('greenspace', 'visibility', greenspaceCheck ? 'visible' : 'none'); 
		map1.setLayoutProperty('transit-lines-white', 'visibility', transitCheck ? 'visible' : 'none');
		map1.setLayoutProperty('parking', 'visibility', parkingCheck ? 'visible' : 'none');

		// Get all layers with 'source-layer' = road
		const roadLayers = map1.getStyle().layers.filter(layer => layer['source-layer'] === 'road'); 
		roadLayers.forEach(layer => map1.setLayoutProperty(layer.id, 'visibility', roadsCheck ? 'visible' : 'none'));
	}

	$: if (map2 && map2.isStyleLoaded() && map2.getLayer('greenspace') && map2.getLayer('transit-lines-white') && map2.getLayer('road-simple') && map2.getLayer('parking')) {
		map2.setLayoutProperty('greenspace', 'visibility', greenspaceCheck ? 'visible' : 'none');
		map2.setLayoutProperty('transit-lines-white', 'visibility', transitCheck ? 'visible' : 'none');
		map2.setLayoutProperty('parking', 'visibility', parkingCheck ? 'visible' : 'none');

		// Get all layers with 'source-layer' = road
		const roadLayers = map2.getStyle().layers.filter(layer => layer['source-layer'] === 'road'); 
		roadLayers.forEach(layer => map2.setLayoutProperty(layer.id, 'visibility', roadsCheck ? 'visible' : 'none'));
	}

	// Transit station visibility toggles
	$: if (map1 && selectedStation1 && mapData[1].data && map1.getLayer('transit-station-points')) {
		map1.setLayoutProperty('transit-station-points', 'visibility', stationCheck ? 'visible' : 'none');
	}

	$: if (map2 && selectedStation2 && mapData[2].data && map2.getLayer('transit-station-points')) {
		map2.setLayoutProperty('transit-station-points', 'visibility', stationCheck ? 'visible' : 'none');
	}

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

		// map1 = new mapboxgl.Map({
		// 	container: 'map1',
		// 	style: 'mapbox://styles/canadianurbaninstitute/cmdge4s08000g01s51sgiaaek',
		// 	center: [-79.238666491, 43.7937808965],
		// 	zoom: 13,
		// 	minZoom: 2,
		// 	maxBounds: mapData[1].bbox,
		// 	// scrollZoom: false,
		// 	// dragPan: false,
		// 	attributionControl: false
		// });

		// // Create second map
		// map2 = new mapboxgl.Map({
		// 	container: 'map2',
		// 	style: 'mapbox://styles/canadianurbaninstitute/cmdge4s08000g01s51sgiaaek',
		// 	center: [-114.0624934, 51.0661771],
		// 	zoom: 13,
		// 	minZoom: 2,
		// 	maxBounds: mapData[2].bbox,
		// 	// scrollZoom: false,
		// 	// dragPan: false,
		// 	attributionControl: false
		// });

		// Load first map
		map1.on('load', () => {
			
			// Add station data source
			map1.addSource('transit-station-data', {
				type: 'geojson',
				data: stationGeojson
			});

			// Add station radius source
			map1.addSource('station-radius', {
          		type: 'geojson',
          		data: mapData[1].circle
        	});

			// Add station radius layer
			map1.addLayer({
				id: 'station-radius',
				type: 'fill',
				source: 'station-radius',
				paint: {
					'fill-color': 'transparent',
            		'fill-opacity': 1.0,
					'fill-outline-color': "red"
				}
        	});

			// Add transit station points
			map1.addLayer({
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

		});

		// Load second map
		map2.on('load', () => {
			map2.addSource('transit-station-data', {
			type: 'geojson',
			data: stationGeojson
		});

		// Add transit station points
  		map2.addLayer({
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

