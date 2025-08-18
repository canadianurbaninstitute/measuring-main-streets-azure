<script>
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../styles.css';
	// --- Data Imports ---
	import stationRawData from '../../lib/data/transitdata/stations.json';
	import transitRegionsRawData from '../../lib/data/transitdata/transit-regions.json';

	export let accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
	export let mapStyle =
		'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true';

	export let containerClass = 'map-container';
	let mapContainer;
	let map;
	let activeLine = null;
	let regionsData = [];
	let selectedStation = {};
	let stationSelected = false;
	let processedStationData = [];
	let activeRegion = null;

	function updateStationData(id) {
		const station = processedStationData.find((s) => s.id === id);

		if (!station) {
			console.error('Station not found for ID:', id);
			selectedStation = {};
			return;
		}

		selectedStation = station;
	}

	function selectLine(line) {
		if (!map) return;
		resetStationSelection();

		activeLine = line;

		// find which line is selected on the map based on id
		const selectedLine = map.queryRenderedFeatures({
			layers: ['transit-lines'],
			filter: ['==', 'line_id', activeLine.id]
		});

		// if there is a line selected, zoom to it based on calculated bbox
		if (selectedLine.length > 0) {
			const featureCollection = {
				type: 'FeatureCollection',
				features: selectedLine
			};

			const combinedBBox = turf.bbox(featureCollection);

			map.fitBounds(combinedBBox, { padding: 50, duration: 1000 });
		}
	}

	function selectStop(station) {
		handleStationSelection(station.id, [station.longitude, station.latitude]);
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

		map.on('mousemove', 'transit-stations', (e) => {
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.stop_label;
				popup.setLngLat(coordinates).setHTML(`<span class="label-name">${name}</span>`).addTo(map);
			}
		});

		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines'], () => {
			map.getCanvas().style.cursor = '';
		});
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<div bind:this={mapContainer} class={containerClass}>
	<div id="map"></div>
</div>

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
