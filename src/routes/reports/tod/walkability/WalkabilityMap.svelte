<script>
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	// You might want to get the token via environment variables or a config file later
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let { map = $bindable(), center, zoom, onStationClick } = $props();

	let mapContainer;

	onMount(() => {
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmkwt0bmm000s01qraw6c3izu',
			center: center || [-79.3832, 43.6532], // Defaulting to Toronto
			zoom: zoom || 11,
			scrollZoom: false, // Recommended false for scroll-telling to prevent trapping the scroll wheel
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		map.on('load', () => {
			// Change cursor to pointer over stations
			map.on('mouseenter', 'station-analysis-points-4cu7xs', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			map.on('mouseleave', 'station-analysis-points-4cu7xs', () => {
				map.getCanvas().style.cursor = '';
			});

			// Handle clicks on the specified station layer
			map.on('click', 'station-analysis-points-4cu7xs', (e) => {
				if (e.features.length > 0) {
					const coordinates = e.features[0].geometry.coordinates.slice();
					const properties = e.features[0].properties;

					// Ensure appropriate zoom levels when handling clusters vs single points
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}

					if (onStationClick) {
						onStationClick({
							lng: coordinates[0],
							lat: coordinates[1],
							properties
						});
					}
				}
			});
		});

		return () => {
			if (map) map.remove();
		};
	});
</script>

<div class="map-wrapper" bind:this={mapContainer}></div>

<style>
	.map-wrapper {
		width: 100%;
		height: 80vh;
		border-radius: 12px;
		overflow: hidden;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
