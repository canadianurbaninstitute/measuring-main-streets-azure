<script lang="ts">
	import circle from '@turf/circle';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import {
		transit_lines_source,
		transit_stations_source
	} from '../../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../../lib/data/transitdata/line-colors.json';
	import Legend from '../../../transit-map/components/Legend.svelte';

	let {
		map = $bindable(),
		center,
		zoom,
		onStationClick,
		onMapLoaded,
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
		if (targetCoords) {
			updateMask(targetCoords);
		}
	});
	// Convert line colours to Mapbox expression
	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [[Number(id)], color]),
		'#000000' // Fallback color
	];

	$effect(() => {
		if (map && fullScreen) {
			// No longer setting permanent padding here.
		}
	});

	onMount(() => {
		// Ensure token is set before map initialization
		mapboxgl.accessToken =
			'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmmtb64tg00c901s149605jdv?optimize=true',
			center: center || [-123.1522, 49.2638], // Defaulting to Arbutus
			zoom: zoom || 11,
			scrollZoom: false, // Recommended false for scroll-telling to prevent trapping the scroll wheel
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		// Change cursor to pointer over stations
		map.on('mouseenter', 'station-analysis-points-expla-c0bvk5', () => {
			if (map && map.getCanvas()) {
				map.getCanvas().style.cursor = 'pointer';
			}
		});

		map.on('mouseleave', 'station-analysis-points-expla-c0bvk5', () => {
			if (map && map.getCanvas()) {
				map.getCanvas().style.cursor = '';
			}
		});

		map.on('load', () => {
			if (!map) return;

			// Add mask sources
			map.addSource('circle-mask', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addSource('circle', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			// Add transit sources
			map.addSource('transit-station-data', {
				type: 'vector',
				url: transit_stations_source.url
			});
			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
			});

			// Add mask layers
			map.addLayer(
				{
					id: 'circle-mask',
					type: 'fill',
					source: 'circle-mask',
					paint: {
						'fill-color': '#fff',
						'fill-opacity': 0.7
					}
				},
				'station-analysis-points-expla-c0bvk5'
			);

			// Add transit layers
			map.addLayer(
				{
					id: 'transit-lines',
					type: 'line',
					source: 'transit-line-data',
					'source-layer': transit_lines_source.source_layer,
					paint: {
						'line-color': lineColorExpression as any,
						'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 7, 2, 12, 4],
						'line-opacity': 1,
						'line-emissive-strength': 1
					}
				},
				'station-analysis-points-expla-c0bvk5'
			);

			map.addLayer({
				id: 'transit-stations',
				type: 'circle',
				source: 'transit-station-data',
				'source-layer': transit_stations_source.source_layer,
				paint: {
					'circle-color': '#fff',
					'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 14, 5],
					'circle-stroke-color': '#000',
					'circle-stroke-width': 3,
					'circle-emissive-strength': 1
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

			if (onMapLoaded) {
				onMapLoaded(map);
			}
		});

		// Handle clicks on the specified station layer
		map.on('click', 'station-analysis-points-expla-c0bvk5', (e) => {
			if (!map) return;
			if (e.features.length > 0) {
				const coordinates = e.features[0].geometry.coordinates.slice();
				const properties = e.features[0].properties;
				const id = e.features[0].id;

				// Ensure appropriate zoom levels when handling clusters vs single points
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				if (map.getSource('selected-station')) {
					map.getSource('selected-station').setData({
						type: 'FeatureCollection',
						features: [e.features[0]]
					});
				}

				if (onStationClick) {
					onStationClick({
						lng: coordinates[0],
						lat: coordinates[1],
						id,
						properties,
						mapInstance: map,
						point: e.point
					});
				}
			}
		});

		return () => {
			if (map) {
				map.remove();
				map = null;
			}
		};
	});
</script>

<div class="map-wrapper {fullScreen ? 'full-screen' : ''}">
	<div bind:this={mapContainer} class="map-instance"></div>
	{#if map}
		<Legend
			{map}
			activeTab="complete-communities"
			missingTier1={[]}
			missingTier2={[]}
			selectedVariable={null}
			min={0}
			max={0}
		/>
	{/if}
</div>

<style>
	.map-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 300px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.map-instance {
		width: 100%;
		height: 100%;
		flex: 1;
	}

	.map-wrapper.full-screen {
		border-radius: 0;
		box-shadow: none;
		min-height: auto;
		height: 100vh;
	}

	:global(.legend) {
		position: absolute !important;
		top: 64px !important;
		right: 10px !important;
		z-index: 10;
		background: rgba(255, 255, 255, 0.95) !important;
		backdrop-filter: blur(4px);
		max-width: 260px;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
		border-radius: 8px !important;
		padding: 12px !important;
	}

	@media (max-width: 768px) {
		:global(.legend) {
			position: relative !important;
			top: 0 !important;
			right: 0 !important;
			max-width: 100% !important;
			background: #fff !important;
			color: #18181b !important;
			border-radius: 0 !important;
			padding: 20px !important;
			box-shadow: none !important;
			border-top: 1px solid #e4e4e7 !important;
		}

		.map-wrapper:not(.full-screen) {
			height: auto !important;
			min-height: 600px;
		}

		.map-wrapper:not(.full-screen) .map-instance {
			height: 400px !important;
			flex: none !important;
		}
	}

	:global(.legend-container) {
		max-height: 80% !important;
		overflow-y: auto !important;
	}

	:global(.mapboxgl-canvas) {
		border-radius: inherit;
	}
</style>
