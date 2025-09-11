<script lang="ts">
	import * as turf from '@turf/turf';
	import type { FeatureCollection, Geometry } from 'geojson';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../styles.css';
	// --- Data Imports ---
	import stationRawData from '../../lib/data/transitdata/stations.json';
	import transitRegionsRawData from '../../lib/data/transitdata/transit-regions.json';

	let { selectedLine = $bindable(), selectedStation = $bindable() } = $props();
	let accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
	let mapStyle = 'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true';

	let containerClass = 'map-container';
	let mapContainer;
	let map;
	let regionsData = [];
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

	function highlightStation(selectedStationId: number | null) {
		if (!map) return;

		if (selectedStationId) {
			// Set color: yellow for selected, original for others
			map.setPaintProperty('transit-stations', 'circle-color', [
				'case',
				['==', ['get', 'id'], selectedStationId],
				'#FFD700', // yellow for selected station
				'#fff' // default station color
			]);
		} else {
			// Reset all stations to default color and opacity
			map.setPaintProperty('transit-stations', 'circle-color', '#fff');
			map.setPaintProperty('transit-stations', 'circle-opacity', 1);
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
				const featureCollection: FeatureCollection<Geometry> = {
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
		selectedStation = 0;
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
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		const popup2 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});
		popup.addClassName('station-popup');
		popup.addClassName('line-popup');

		map.on('mouseenter', ['transit-stations', 'transit-lines'], () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mousemove', 'transit-lines', (e) => {
			map.getCanvas().style.cursor = 'pointer';
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.name;
				popup.setLngLat(coordinates).setHTML(`<span class="label-name">${name}</span>`).addTo(map);
			}
		});

		map.on('mousemove', 'transit-stations', (e) => {
			map.getCanvas().style.cursor = 'pointer';
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.stop_label;
				popup.setLngLat(coordinates).setHTML(`<span class="label-name">${name}</span>`).addTo(map);
			}
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines'], () => {
			map.getCanvas().style.cursor = '';
			popup.remove();
			popup2.remove();
		});

		map.on('click', ['transit-lines', 'transit-stations'], (e) => {
			if (e.features.length > 0) {
				const lineProp = e.features[0]?.properties?.line_id ?? null;
				const stationId = e.features[0]?.properties?.id ?? null;

				let lineIds: number[] = [];
				if (typeof lineProp === 'string') {
					lineIds = lineProp.split(',').map((l) => +l.trim());
				} else if (typeof lineProp === 'number') {
					lineIds = [lineProp];
				}

				const lineId = lineIds[0];
				if (lineId && +lineId !== selectedLine) {
					highlightLine(+lineId);
					selectCurrentLine(+lineId);
					selectedLine = +lineId;
				}
				if (stationId) {
					highlightStation(stationId);
					selectedStation = +stationId;
				}
				if (!stationId) {
					highlightStation(null);
					selectedStation = 0;
				}
			} else {
				clearSelection();
			}
		});

		map.on('load', () => {
			// force recalculation of container dimensions
			map.resize();
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
		width: 100%;
		height: 100%;
		position: relative;
		order: -1;
	}

	.map-container {
		position: relative;
		border: 1px solid #eee;
		width: 100%;
		min-height: 200px;
		height: 100%;
		border-radius: 8px;
	}
</style>
