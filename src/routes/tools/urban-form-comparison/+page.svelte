<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import * as turf from '@turf/turf';

	import stationRawData from '../../lib/data/stations.json';

    import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Initialize maps
	let map1;
	let map2;

	// Initial stations
	let selectedStation1 = "Markham North (Line 7: Eglinton East LRT)";
	let selectedStation2 = "144 Avenue N (Green Line)";

	// Initialize station variables
	let station1Data = {};
	let station2Data = {};
	let station1Coords = [];
	let station2Coords = [];

	// For creating bounding boxes
	const radiusInKilometers = 0.8;
	let circle1;
	let circle2;
	let bbox1;
	let bbox2;

	// Add label field for stations
	const stationsProcessed = stationRawData.map(station => ({
		...station,
		label: `${station.stop_label} (${station.line_display_names})`
	}));

	// List of stations for dropdown
	const stations = stationsProcessed.map(station => station.label);

	// Create circle and bounding box for first station
	$: if (selectedStation1) {
		station1Data = stationsProcessed.find(station => station.label === selectedStation1);
		station1Coords = [station1Data.longitude, station1Data.latitude];
		circle1 = turf.circle(station1Coords, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		bbox1 = turf.bbox(circle1);
	}

	// Create circle and bounding box for second station
	$: if (selectedStation2) {
		station2Data = stationsProcessed.find(station => station.label === selectedStation2);
		station2Coords = [station2Data.longitude, station2Data.latitude];
		circle2 = turf.circle(station2Coords, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		bbox2 = turf.bbox(circle2);
	}

	// Update map bounds and center based on selection
	$: if (map1 && selectedStation1 && station1Data && circle1) {
		// Check if the source exists before trying to update it
		if (map1.getSource('station-radius')) {
			// Update the radius circle data
			map1.getSource('station-radius').setData(circle1);
		}
		
		// Update map bounds and center
		map1.setMaxBounds(bbox1);
		map1.setCenter(station1Coords);
	}

	// Update map bounds and center based on selection
	$: if (map2 && selectedStation2 && station2Data && circle2) {
		// Check if the source exists before trying to update it
		if (map2.getSource('station-radius')) {
			// Update the radius circle data
			map2.getSource('station-radius').setData(circle1);
		}
		
		// Update map bounds and center
		map2.setMaxBounds(bbox2);
		map2.setCenter(station2Coords);
	}

	onMount(() => {
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
			name: point.stop_label
			}
		}))
		};

		// Create polygon from bounding box
		const bboxPolygon = {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [[
				[bbox1[0], bbox1[1]], // southwest
				[bbox1[2], bbox1[1]], // southeast
				[bbox1[2], bbox1[3]], // northeast
				[bbox1[0], bbox1[3]], // northwest
				[bbox1[0], bbox1[1]]  // close the polygon
				]]
			}
			};

		const mapBounds1 = [[bbox1[0], bbox1[1]], [bbox1[2], bbox1[3]]]

		// Create first map
		map1 = new mapboxgl.Map({
			container: 'map1',
			style: 'mapbox://styles/canadianurbaninstitute/cmddiqsp202kn01s4789nbj0l',
			center: [-79.238666491, 43.7937808965],
			zoom: 13,
			minZoom: 2,
			maxBounds: mapBounds1,
			scrollZoom: true,
			// dragPan: false,
			attributionControl: false
		});

		// Create second map
		map2 = new mapboxgl.Map({
			container: 'map2',
			style: 'mapbox://styles/canadianurbaninstitute/cmddiqsp202kn01s4789nbj0l',
			center: [-114.0624934, 51.0661771],
			zoom: 13,
			minZoom: 2,
			maxBounds: bbox2,
			scrollZoom: true,
			attributionControl: false
		});

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
          		data: circle1
        	});

			// Add bounding box source
			map1.addSource('bbox', {
				type: 'geojson',
				data: bboxPolygon
			});
			
			// Add station radius layer
			map1.addLayer({
				id: 'station-radius',
				type: 'fill',
				source: 'station-radius',
				paint: {
					'fill-color': '#8CCFFF',
					'fill-opacity': 0.2
				}
        	});

			// Add bbox layer
			map1.addLayer({
				id: 'bbox-fill',
				type: 'fill',
				source: 'bbox',
				paint: {
					'fill-color': '#088',
					'fill-opacity': 0.2
				}
			});

			// Add transit station points
			map1.addLayer({
				id: 'all-transit-station-point',
				type: 'circle',
				source: 'transit-station-data',
				paint: {
					'circle-radius': 14,
					'circle-color': 'white',
					'circle-stroke-color': 'black',
					'circle-stroke-width': 2
					}
			});

			map1.addLayer({
				id: 'transit-station-point',
				type: 'circle',
				source: 'transit-station-data',
				paint: {
					'circle-radius': 10,
					'circle-color': '#FF5722',
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
      			'circle-color': '#FF5722',
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
	<p>
		Description
	</p>
</div>

<div class = "station-selection">

	<div id="select1">
		<select bind:value={selectedStation1}>
			<option disabled selected value={null}>Markham North (Line 7: Eglinton East LRT)</option>
			{#each stations as station}
			<option value={station}>
				{station}
			</option>
			{/each}
		</select>
	</div>

	<div id="select2">
		<select bind:value={selectedStation2}>
			<option disabled selected value={null}>144 Avenue N (Green Line)</option>
			{#each stations as station}
			<option value={station}>
				{station}
			</option>
			{/each}
		</select>
	</div>


</div>

<div class="map-container">
	<div id="map1" />
	<div id="map2" />
</div>



<style>
	#map1, #map2 {
		width: 450px;
		height: 450px;
		border-radius: 50%; /* Circular frame */
		overflow: hidden;   /* Clip map to circle */
		border: 4px solid #333;
	}
	.map-container {
		display: flex;
		flex-direction: row;
	}
	.station-selection {
		width: 400px;
	}
	#select1, #select2 {
		width: 400px;
	}
</style>

