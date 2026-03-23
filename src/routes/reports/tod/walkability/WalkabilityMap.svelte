<script lang="ts">
	import circle from '@turf/circle';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	// You might want to get the token via environment variables or a config file later
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
		if (targetCoords) {
			updateMask(targetCoords);
		}
	});

	$effect(() => {
		if (map && fullScreen) {
			// When full screen, add left padding so the map's visual center
			// isn't obscured by the 40% text overlay on the left.
			map.setPadding({
				left:
					typeof window !== 'undefined' && window.innerWidth > 1024 ? window.innerWidth * 0.4 : 0,
				right: 0,
				top: 0,
				bottom: 0
			});
		} else if (map) {
			map.setPadding({ left: 0, right: 0, top: 0, bottom: 0 });
		}
	});

	onMount(() => {
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
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'station-analysis-points-expla-c0bvk5', () => {
			map.getCanvas().style.cursor = '';
		});

		map.on('load', () => {
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

			map.addLayer(
				{
					id: 'circle-radius',
					type: 'line',
					source: 'circle',
					paint: {
						'line-color': '#ffffff',
						'line-opacity': 1,
						'line-width': 2,
						'line-dasharray': [2, 2]
					}
				},
				'station-analysis-points-expla-c0bvk5'
			);

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

		// Handle clicks on the specified station layer
		map.on('click', 'station-analysis-points-expla-c0bvk5', (e) => {
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
	});
</script>

<div class="map-wrapper {fullScreen ? 'full-screen' : ''}" bind:this={mapContainer}></div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		min-height: 400px;
		border-radius: 12px;
		overflow: visible;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.map-wrapper.full-screen {
		border-radius: 0;
		box-shadow: none;
		min-height: 100vh;
	}

	:global(.mapboxgl-canvas) {
		border-radius: inherit;
	}
</style>
