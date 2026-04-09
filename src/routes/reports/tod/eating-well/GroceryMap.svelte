<script lang="ts">
	import circle from '@turf/circle';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { transit_lines_source } from '../../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../../lib/data/transitdata/line-colors.json';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let {
		map = $bindable(),
		center,
		zoom,
		onStationClick,
		activeCoords,
		fullScreen = false
	} = $props();

	let mapContainer;

	function updateMask(coords) {
		if (!map || !map.getSource('circle') || !map.getSource('circle-mask') || !coords) return;

		const radiusInKm = 0.8;
		const circleFeature = circle(coords, radiusInKm, {
			steps: 128,
			units: 'kilometers'
		});

		const maskFeature = {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [
					// Outer ring (world bounds)
					[
						[-180, -90],
						[180, -90],
						[180, 90],
						[-180, 90],
						[-180, -90]
					],
					// Inner ring (circle - reversed coordinates)
					[...circleFeature.geometry.coordinates[0]].reverse()
				]
			}
		};

		map.getSource('circle').setData({
			type: 'FeatureCollection',
			features: [circleFeature]
		});

		map.getSource('circle-mask').setData({
			type: 'FeatureCollection',
			features: [maskFeature]
		});
	}

	$effect(() => {
		const targetCoords = activeCoords || center;
		if (targetCoords && map && map.getSource('circle')) {
			updateMask(targetCoords);
		}
	});

	onMount(() => {
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmn7wup2g001n01s6hree42l7?optimize=true',
			center: center || [-79.3832, 43.6532], // Defaulting to Toronto
			zoom: zoom || 11,
			scrollZoom: false,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		// Change cursor to pointer over interactive layers
		const interactiveLayers = ['station-analysis-points-expla-c0bvk5', 'grocery-stores'];
		interactiveLayers.forEach((layer) => {
			map.on('mouseenter', layer, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', layer, () => {
				map.getCanvas().style.cursor = '';
			});
		});

		map.on('load', () => {
			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
			});

			// Add mask sources
			map.addSource('circle-mask', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addSource('circle', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			// Add mask layers
			map.addLayer({
				id: 'circle-mask',
				type: 'fill',
				source: 'circle-mask',
				paint: {
					'fill-color': '#fff',
					'fill-opacity': 0.7
				}
			});

			map.addLayer({
				id: 'circle-radius',
				type: 'line',
				source: 'circle',
				paint: {
					'line-color': '#ffffff',
					'line-opacity': 1,
					'line-width': 2,
					'line-dasharray': [2, 2]
				}
			});

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

			map.addLayer({
				id: 'transit-lines',
				type: 'line',
				source: 'transit-line-data',
				'source-layer': transit_lines_source.source_layer,
				paint: {
					'line-color': lineColorExpression as mapboxgl.DataDrivenPropertyValueSpecification<string>,
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

			map.addSource('selected-station', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addLayer({
				id: 'selected-station-highlight',
				type: 'circle',
				source: 'selected-station',
				paint: {
					'circle-radius': 5,
					'circle-stroke-width': 3,
					'circle-stroke-color': '#ffffff',
					'circle-emissive-strength': 1,
					'circle-color': 'transparent'
				}
			});

			// Initial mask update
			const targetCoords = activeCoords || center;
			if (targetCoords) {
				updateMask(targetCoords);
			}
		});
	});
</script>

<div class="map-wrapper {fullScreen ? 'full-screen' : ''}" bind:this={mapContainer}></div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		min-height: 300px;
		border-radius: 12px;
		overflow: visible;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.map-wrapper.full-screen {
		border-radius: 0;
		box-shadow: none;
		min-height: auto;
		height: 100vh;
	}

	:global(.mapboxgl-canvas) {
		border-radius: inherit;
	}
</style>

