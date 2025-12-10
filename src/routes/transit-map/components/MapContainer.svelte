<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import Legend from './StationSummary.svelte';
	let {
		selectedVariable,
		min,
		max,
		activeTab,
		updateLayerVariable,
		statusFilters,
		technologyFilters,
		map = $bindable(),
		mapCenter,
		defaultZoom,
		processedStationData,
		selectStop,
		selectRegion,
		regionsData
	} = $props();

	// --- Mapbox Access Token ---
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	$effect(() => {
		if (!map) return;
		applyFilters();
	});

	onMount(async () => {
		// add map
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cmif0wnev003201s3b0btg8te?optimize=true', // no transit lines
			center: mapCenter,
			zoom: defaultZoom,
			maxZoom: 15.5,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);
		// add map sources and layers
		map.on('load', () => {
			// Add transit sources
			map.addSource('transit-station-data', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.btyr8w65'
			});
			map.addSource('transit-line-data', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.683e8euy'
			});
			map.addSource('transit-region-data', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.003rt68i'
			});
			// Add mask source
			map.addSource('circle-mask', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			// Add circle source
			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			map.addSource('da_map-bco47g', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.1cu02ydb'
			});

			// Add layers
			map.addLayer({
				id: 'transit-lines',
				type: 'line',
				source: 'transit-line-data',
				'source-layer': 'merged_map_lines',
				paint: {
					'line-color':
						lineColorExpression as mapboxgl.DataDrivenPropertyValueSpecification<string>,
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
				'source-layer': 'merged_map_stations-bcc58j',
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
			map.addLayer({
				id: 'circle-mask',
				type: 'fill',
				source: 'circle-mask',
				paint: {
					'fill-color': '#ffffff', // match your background color
					'fill-opacity': 0.8
				}
			});
			map.addLayer(
				{
					id: 'circle-radius',
					type: 'line',
					source: 'circle',
					paint: {
						'line-color': '#222',
						'line-opacity': 1,
						'line-width': 3,
						'line-dasharray': [2, 2]
					}
				},
				'transit-stations'
			);
			map.addLayer({
				id: 'transit-region-points',
				type: 'circle',
				source: 'transit-region-data',
				'source-layer': 'transit-region-points-9m4y8g',
				paint: {
					'circle-color': '#34bef9',
					'circle-radius': 8,
					'circle-stroke-color': '#fff',
					'circle-stroke-width': 1
				},
				maxzoom: 5
			});

			// click function for transit layers
			map.on('click', 'transit-stations', (e) => {
				if (e.features.length > 0) {
					const stationId = e.features[0].properties.id;
					const stationDataForClick = processedStationData.find((s) => s.id === stationId);
					if (stationDataForClick) {
						selectStop(stationDataForClick);
					}
				}
			});
			// click function for transit region points
			map.on('click', 'transit-region-points', (e) => {
				const regionId = e.features[0].properties.id;
				const regionClicked = regionsData.find((r) => r.id === regionId);
				selectRegion(regionClicked);
			});

			map.on('zoom', () => {
				if (map.getLayer('da')) {
					updateLayerVariable(selectedVariable);
				}
			});
		});

		// show popups on hover
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup.addClassName('station-popup');

		const popup2 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup.addClassName('line-popup');

		const popup3 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup3.addClassName('region-popup');

		map.on('mouseenter', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mousemove', 'transit-stations', (e) => {
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.stop_label;

				popup
					.setLngLat(coordinates)
					.setHTML(
						`
                <span class="label-name">${name}</span>
            			`
					)
					.addTo(map);
			}
		});

		map.on('mousemove', 'transit-region-points', (e) => {
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.region;

				if (map.getZoom() <= 5) {
					// only show pop-up if map is zoomed out
					popup3
						.setLngLat(coordinates)
						.setHTML(
							`
					<span class="label-name">${name}</span>
							`
						)
						.addTo(map);
				}
			}
		});

		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		map.on('mouseleave', 'transit-region-points', () => {
			popup3.remove();
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			map.getCanvas().style.cursor = '';
		});
	});

	// --- Filter/Tab UI Handlers ---
	function applyFilters() {
		if (!map) return; // <-- Prevents the crash
		const filterConditions = [];

		if (statusFilters.length) {
			filterConditions.push([
				'any',
				...statusFilters.map((status) => [
					'case',
					['!=', ['index-of', status, ['get', 'status']], -1],
					true,
					false
				])
			]);
		}

		if (technologyFilters.length) {
			filterConditions.push([
				'any',
				...technologyFilters.map((tech) => [
					'case',
					['!=', ['index-of', tech, ['get', 'technology']], -1],
					true,
					false
				])
			]);
		}

		const combinedFilter = filterConditions.length ? ['all', ...filterConditions] : null;

		const layers = ['transit-stations', 'transit-lines'];
		if (!layers || layers.length === 0) return;

		layers.forEach((layer) => {
			if (map.getLayer(layer)) {
				map.setFilter(layer, combinedFilter);
			}
		});
	}
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
</script>

<div id="map-container">
	<div id="map"></div>
	<Legend {map} {activeTab} {selectedVariable} {min} {max} />
</div>

<style>
	#map {
		height: 100%;
		width: 100%;
		position: relative;
		order: -1;
	}

	#map-container {
		height: 100%;
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	@media only screen and (max-width: 768px) {
		#map-container {
			min-height: 100vw;
		}

		#map {
			min-height: 100vw;
		}
	}
</style>
