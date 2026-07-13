<script lang="ts">
	import * as turf from '@turf/turf';
	import type { FeatureCollection, Geometry } from 'geojson';
	import mapboxgl from 'mapbox-gl';
	import { onMount, tick } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import {
		transit_charts_style,
		transit_lines_source,
		transit_stations_source
	} from '../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import '../../styles.css';
	// --- Data Imports ---
	// import stationRawData from '../../lib/data/transitdata/stations.json';
	// import transitRegionsRawData from '../../lib/data/transitdata/transit-regions.json';

	let {
		selectedLine = $bindable(),
		selectedStation = $bindable(),
		currentData,
		selectedVariable
	} = $props();
	let accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;
	let mapStyle = transit_charts_style.url;

	let containerClass = 'map-container';
	let mapContainer;
	let map;
	let regionsData = [];
	let stationSelected = false;
	let processedStationData = [];
	let activeRegion = null;
	let stationRawData;
	let transitRegionsRawData = [];
	let lineIndex = new Map();

	function desaturate(hex: string, amount = 0.5): string {
		// amount = 0 → original, 1 → fully grey
		const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
		const avg = (r + g + b) / 3;
		const newR = Math.round(r + (avg - r) * amount);
		const newG = Math.round(g + (avg - g) * amount);
		const newB = Math.round(b + (avg - b) * amount);
		return `rgb(${newR}, ${newG}, ${newB})`;
	}

	function buildLineIndex(regionsData) {
		const index = new Map();
		regionsData.forEach((region) => {
			region.lines.forEach((line) => {
				index.set(line.id, region.bbox);
			});
		});
		return index;
	}

	// const lineIndex = buildLineIndex(transitRegionsRawData);

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

		const matchExpression: any[] = ['match', ['get', 'line_id']];

		Object.entries(line_colors).forEach(([id, color]) => {
			const numericId = Number(id);
			if (numericId === selectedLineId) {
				matchExpression.push(numericId, color); // keep original
			} else {
				matchExpression.push(numericId, desaturate(color, 1)); // desaturate others
			}
		});

		matchExpression.push('#cccccc'); // fallback

		map.setPaintProperty('transit-lines', 'line-color', matchExpression);
	}

	function highlightStation(selectedStationId: number | null) {
		if (!map) return;
		if (!map.getLayer('transit-stations')) return;

		if (selectedStationId) {
			// Set color: yellow for selected, original for others
			map.setPaintProperty('transit-stations', 'circle-color', [
				'case',
				['==', ['get', 'id'], selectedStationId.toString()],
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
			if (!map.getLayer('transit-lines')) return;
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

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/map_stations.json'
			);
			stationRawData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
			return;
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/transit-regions.json'
			);
			transitRegionsRawData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
			return;
		}

		if (!accessToken) {
			console.error('Mapbox access token is required');
			return;
		}

		lineIndex = buildLineIndex(transitRegionsRawData);

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

		map.on('load', async () => {
			await tick();
			map.resize();

			// If there's already a selectedLine, zoom to it after map loads
			if (selectedLine) {
				selectCurrentLine(selectedLine);
			}

			// Add transit layer sources
			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
			});
			map.addSource('transit-station-data', {
				type: 'vector',
				url: transit_stations_source.url
			});
			// Add transit layers
			map.addLayer({
				id: 'transit-lines',
				type: 'line',
				source: 'transit-line-data',
				'source-layer': transit_lines_source.source_layer,
				paint: {
					'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 7, 4, 12, 8],
					'line-dasharray': [
						'case',
						[
							'any',
							['==', ['get', 'status'], 'Construction'],
							['==', ['get', 'status'], 'Planned']
						],
						['literal', [1, 2]],
						['literal', [1, 0]]
					]
				}
			});
			map.addLayer({
				id: 'transit-stations',
				type: 'circle',
				source: 'transit-station-data',
				'source-layer': transit_stations_source.source_layer,
				paint: {
					'circle-color': '#fff',
					'circle-radius': [
						'interpolate',
						['linear'],
						['zoom'],
						6,
						0, // Zoom level, radius
						7,
						2,
						10,
						3,
						12,
						6,
						14,
						10
					],
					'circle-stroke-color': '#000',
					'circle-stroke-width': [
						'interpolate',
						['linear'],
						['zoom'],
						6,
						0, // Zoom level, width
						7,
						0.8,
						10,
						1.5,
						13,
						2
					]
				},
				minzoom: 6
			});
			if (currentData && selectedVariable) {
				updateStationCircles();
			}
		});
	});

	$effect(() => {
		const line = selectedLine; // ensure tracked
		if (!map || line == null) return;
		selectCurrentLine(line);
		(async () => {
			await tick();
			map.resize();
		})();
	});

	$effect(() => {
		highlightStation(selectedStation ?? null);
	});

	$effect(() => {
		// Explicitly track these values
		const data = currentData;
		const variable = selectedVariable;
		const layer = map?.getLayer('transit-stations');

		if (layer && data && variable) {
			updateStationCircles();
		}
	});

	function updateStationCircles() {
		if (!map || !map.getLayer('transit-stations')) return;

		// Get the metric values to determine scale
		const values = currentData
			.map((station) => station[selectedVariable])
			.filter((val) => val != null && !isNaN(val));

		if (values.length === 0) return;

		const maxValue = Math.max(...values);
		const minValue = Math.min(...values);

		// Create a lookup map: station ID -> normalized value
		const valueMap = new Map();
		currentData.forEach((station) => {
			if (station.id && station[selectedVariable] != null) {
				const normalizedSize = normalizeValue(
					station[selectedVariable],
					minValue,
					maxValue,
					3, // min circle radius
					15 // max circle radius
				);
				valueMap.set(station.id.toString(), normalizedSize);
			}
		});

		// Build a Mapbox expression to set circle radius based on station ID
		const radiusExpression: any[] = ['case'];

		valueMap.forEach((size, stationId) => {
			radiusExpression.push(['==', ['get', 'id'], stationId], size);
		});

		// Fallback: default radius for stations not in currentData
		radiusExpression.push(3);

		// Update the circle-radius paint property
		map.setPaintProperty('transit-stations', 'circle-radius', [
			'interpolate',
			['linear'],
			['zoom'],
			6,
			0,
			7,
			['*', radiusExpression, 0.5],
			10,
			['*', radiusExpression, 0.8],
			12,
			radiusExpression,
			14,
			['*', radiusExpression, 1.5]
		]);

		map.setPaintProperty('transit-stations', 'circle-opacity', 0.8);
	}

	function normalizeValue(
		value: number,
		min: number,
		max: number,
		newMin: number,
		newMax: number
	): number {
		if (max === min) return (newMin + newMax) / 2;
		return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
	}
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
		min-height: 600px;
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

	:global(.mapboxgl-popup-content) {
		background: var(--color-slate-900) !important;
		padding: 6px !important;
		border-radius: 6px !important;
	}
</style>
