<script lang="ts">
	import * as turf from '@turf/turf';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../styles.css';
	// --- Data Imports ---
	import stationRawData from '../../lib/data/transitdata/stations.json';
	import transitRegionsRawData from '../../lib/data/transitdata/transit-regions.json';

	let { selectedLine = $bindable() } = $props();
	let accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
	let mapStyle = 'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true';

	let containerClass = 'map-container';
	let mapContainer;
	let map;
	let regionsData = [];
	let selectedStation = {};
	let stationSelected = false;
	let processedStationData = [];
	let activeRegion = null;

	function buildLineIndex(regionsData) {
		const index = new Map();
		regionsData.forEach((region) => {
			region.lines.forEach((line) => {
				index.set(line.id, region.bbox);
			});
		});
		return index;
	}

	// usage
	const lineIndex = buildLineIndex(transitRegionsRawData);
	function updateStationData(id) {
		const station = processedStationData.find((s) => s.id === id);

		if (!station) {
			console.error('Station not found for ID:', id);
			selectedStation = {};
			return;
		}

		selectedStation = station;
	}

	function highlightLine(selectedLineId: number | null) {
		if (!map) return;
		if (selectedLineId) {
			map.setPaintProperty('transit-lines', 'line-opacity', [
				'match',
				['get', 'line_id'],
				selectedLineId,
				1, // selected line fully opaque
				0.2 // other lines semi-transparent
			]);
		} else {
			map.setPaintProperty('transit-lines', 'line-opacity', 1);
		}
	}

	function selectCurrentLine(line: number) {
		if (!map || !line) return;

		// Step 1: zoom to the region first
		const bounds = lineIndex.get(line);
		if (!bounds) {
			console.warn('No region bounds found for line:', line);
			return;
		}
		map.fitBounds(bounds, { padding: 50, duration: 1000 });
		// Step 2: wait for the line's features to be fully loaded
		const handleDataEvent = (e) => {
			// Only proceed once tiles for 'transit-lines' layer are loaded
			if (!e.isSourceLoaded) return;
			const features = map.queryRenderedFeatures({
				layers: ['transit-lines'],
				filter: ['==', 'line_id', line]
			});
			if (features.length) {
				// Compute bbox of the line
				const featureCollection = {
					type: 'FeatureCollection',
					features
				};
				const combinedBBox = turf.bbox(featureCollection);
				map.fitBounds(combinedBBox, { padding: 50, duration: 1000 });
				highlightLine(line);
				// Remove listener once done
				map.off('sourcedata', handleDataEvent);
			}
		};
		map.on('sourcedata', handleDataEvent);
	}

	function clearSelection() {
		highlightLine(null); // restore all colors
	}

	onMount(() => {
		if (!accessToken) {
			console.error('Mapbox access token is required');
			return;
		}
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
		mapboxgl.accessToken = accessToken;
		map = new mapboxgl.Map({
			container: mapContainer,
			style: mapStyle,
			center: [-89, 58],
			zoom: 3.3,
			maxZoom: 15.5,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.getCanvas().style.cursor = 'pointer';

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);

		// show popups on hover
		// const popup = new mapboxgl.Popup({
		// 	closeButton: false,
		// 	closeOnClick: false
		// });

		// const popup2 = new mapboxgl.Popup({
		// 	closeButton: false,
		// 	closeOnClick: false
		// });
		// popup.addClassName('station-popup');
		// popup.addClassName('line-popup');

		// map.on('mouseenter', ['transit-stations', 'transit-lines'], () => {
		// 	map.getCanvas().style.cursor = 'pointer';
		// });

		// map.on('mousemove', 'transit-stations', (e) => {
		// 	map.getCanvas().style.cursor = 'pointer';
		// 	if (e.features.length > 0) {
		// 		const coordinates = e.lngLat;
		// 		const name = e.features[0].properties.stop_label;
		// 		popup.setLngLat(coordinates).setHTML(`<span class="label-name">${name}</span>`).addTo(map);
		// 	}
		// });

		// map.on('mouseleave', 'transit-stations', () => {
		// 	popup.remove();
		// });

		// map.on('mouseleave', 'transit-lines', () => {
		// 	popup2.remove();
		// });

		// map.on('mouseleave', ['transit-stations', 'transit-lines'], () => {
		// 	map.getCanvas().style.cursor = '';
		// });

		map.on('click', 'transit-lines', (e) => {
			if (e.features.length > 0) {
				const lineId = e.features[0].properties.line_id;
				selectedLine = lineId;
				highlightLine(lineId);
				selectCurrentLine(lineId);
			} else {
				clearSelection();
			}
		});

		map.on('click', 'transit-stations', (e) => {
			if (e.features.length > 0) {
				// const stationId = e.features[0].properties.id;
				// const stationDataForClick = processedStationData.find((s) => s.id === stationId);
				// if (stationDataForClick) {
				// 	selectStop(stationDataForClick);
				// }
			}
		});
	});

	$effect(() => {
		if (map && selectedLine) {
			selectCurrentLine(selectedLine);
		}
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
	<script
		src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"
	></script>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
		type="text/css"
	/>
</svelte:head>
<div bind:this={mapContainer} class={containerClass} id="map"></div>

<style>
	#map {
		height: 50vh;
		width: 100%;
		position: relative;
		order: -1;
	}

	.map-container {
		position: relative;
		border: 1px solid #eee;
		width: 100%;
		height: 400px;
		max-width: 90vw;
		border-radius: 8px;
	}
</style>
