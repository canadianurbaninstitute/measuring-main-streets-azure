<script>
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onMount } from 'svelte';
	import '../../../../styles.css';

	let { visible, stationsData = null, libsData = null, ccsData = null } = $props();

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let map;
	let mapContainer;

	const regions = [
		{ name: 'Greater Golden Horseshoe', center: [-79.3832, 43.6532], zoom: 10 },
		{ name: 'Montreal', center: [-73.5673, 45.5017], zoom: 10 },
		{ name: 'Greater Vancouver/Lower Mainland', center: [-123.1207, 49.2827], zoom: 10 },
		{ name: 'Calgary', center: [-114.0719, 51.0447], zoom: 10 },
		{ name: 'Edmonton', center: [-113.4909, 53.5461], zoom: 10 },
		{ name: 'Ottawa-Gatineau', center: [-75.6972, 45.4215], zoom: 10 }
	];

	let activeRegion = $state(regions[0]);

	function zoomToRegion(region) {
		activeRegion = region;
		if (map) {
			map.flyTo({
				center: region.center,
				zoom: region.zoom,
				duration: 2000
			});
		}
	}

	// Crucial: Resize the map when it becomes visible
	$effect(() => {
		if (visible && map) {
			map.resize();
		}
	});

	onMount(async () => {
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmo1zctqo002101qfd7qo41oi',
			center: activeRegion.center,
			zoom: activeRegion.zoom,
			attributionControl: false
		});

		map.on('load', () => {
			map.setPaintProperty('map-stations-with-amenity-sta-4hoz3b', 'fill-opacity', 0);
			map.setPaintProperty('map-libraries-7supfh', 'icon-opacity', 0);
			map.setPaintProperty('map-community-centres-2h0bby', 'icon-opacity', 0);

			const popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false,
				className: 'mapbox-custom-popup',
				offset: 15
			});

			const stationLayers = ['core-access-by-pop-map-5dguw5'];

			stationLayers.forEach((layer) => {
				if (!map.getLayer(layer)) return;

				map.on('mouseenter', layer, () => {
					map.getCanvas().style.cursor = 'pointer';
				});

				map.on('mouseleave', layer, () => {
					map.getCanvas().style.cursor = '';
					popup.remove();
				});

				map.on('mousemove', layer, (e) => {
					if (e.features.length > 0) {
						const feature = e.features[0];
						const props = feature.properties;

						// Try different property names commonly found in your datasets
						const name = props.stop_label || props.name || props.Station || 'Unknown Station';
						const score = props.overall_score || props.score || props.access_score || 'N/A';

						const content = `
							<div class="popup-inner">
								<div class="popup-title">${name}</div>
								<div class="popup-stat">
									<span class="stat-label">Access/Pop Score:</span>
									<span class="stat-value ${score.toLowerCase().replace(' ', '-')}">${score}</span>
								</div>
							</div>
						`;

						popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
					}
				});
			});
		});

		return () => map.remove();
	});
</script>

<div class="map-wrapper {visible ? 'visible' : ''}">
	<div class="region-nav">
		{#each regions as region}
			<button class:active={activeRegion.name === region.name} onclick={() => zoomToRegion(region)}>
				{region.name}
			</button>
		{/each}
	</div>
	<div bind:this={mapContainer} class="map-container"></div>
	<div class="legend">
		<div class="legend-title">Core Amenity Availability vs Population</div>
		<div class="legend-item"><span class="dot high-high"></span>High access, High population</div>
		<div class="legend-item"><span class="dot high-low"></span>High access, Low population</div>
		<div class="legend-item"><span class="dot low-high"></span>Low access, High population</div>
		<div class="legend-item"><span class="dot low-low"></span>Low access, Low population</div>
	</div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		background: #f1f5f9;
		min-height: 600px;
	}

	.map-container {
		width: 100%;
		height: 100%;
	}

	.region-nav {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-width: 300px;
	}

	.region-nav button {
		background: white;
		border: 1px solid #e2e8f0;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.region-nav button:hover {
		background: #f8fafc;
	}

	.region-nav button.active {
		background: var(--color-blue-400);
		color: white;
		border-color: var(--color-blue-500);
	}

	.legend {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(4px);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border: 1px solid #e2e8f0;
	}

	.legend-title {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		color: #64748b;
		margin-bottom: 0.25rem;
	}

	.divider {
		height: 1px;
		background: #e2e8f0;
		margin: 0.25rem 0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #334155;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}

	.swatch.both {
		background: #10b981;
	}
	.swatch.one {
		background: #3b82f6;
	}
	.swatch.none {
		background: #ef4444;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid white;
	}

	.dot.high-high {
		background: var(--color-yellow-200);
	}
	.dot.high-low {
		background: var(--color-pink-500);
	}
	.dot.low-high {
		background: var(--color-green-200);
	}
	.dot.low-low {
		background: var(--color-blue-400);
	}

	/* Mapbox Popup Styling */
	:global(.mapbox-custom-popup .mapboxgl-popup-content) {
		padding: 0.75rem;
		border-radius: 8px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border: 1px solid #e2e8f0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(4px);
		min-width: 180px;
	}

	:global(.popup-inner) {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	:global(.popup-title) {
		font-weight: 700;
		font-size: 0.85rem;
		color: #1e293b;
		line-height: 1.2;
	}

	:global(.popup-stat) {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	:global(.stat-label) {
		font-size: 0.65rem;
		text-transform: uppercase;
		font-weight: 700;
		color: #64748b;
		letter-spacing: 0.025em;
	}

	:global(.stat-value) {
		font-size: 0.8rem;
		font-weight: 600;
		color: #334155;
	}

	:global(.stat-value.high-high) {
		color: var(--color-yellow-600, #b45309);
	}
	:global(.stat-value.high-low) {
		color: var(--color-pink-600, #be185d);
	}
	:global(.stat-value.low-high) {
		color: var(--color-green-600, #15803d);
	}
	:global(.stat-value.low-low) {
		color: var(--color-blue-600, #1d4ed8);
	}
</style>
