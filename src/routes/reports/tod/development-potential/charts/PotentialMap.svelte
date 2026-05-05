<script>
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onMount } from 'svelte';
	import '../../../../styles.css';

	let { visible, region = undefined, highlightIds = [] } = $props();

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let map;
	let mapContainer;
	let stationData = $state([]);
	let innerWidth = $state(0);

	const regions = [
		{ name: 'Canada', center: [-110, 54.912], zoom: 4 },
		{ name: 'Greater Golden Horseshoe', center: [-79.3832, 43.6532], zoom: 10 },
		{ name: 'Montreal', center: [-73.5673, 45.5017], zoom: 10 },
		{ name: 'Greater Vancouver', center: [-123.1207, 49.2827], zoom: 10 },
		{ name: 'Calgary', center: [-114.0719, 51.0447], zoom: 10 },
		{ name: 'Edmonton', center: [-113.4909, 53.5461], zoom: 10 },
		{ name: 'Ottawa-Gatineau', center: [-75.6972, 45.4215], zoom: 10 },
		{ name: 'Ville de Québec', center: [-71.2082, 46.8131], zoom: 10 }
	];

	let activeRegion = $state(regions[0]);

	function zoomToRegion(regionObj) {
		activeRegion = regionObj;
		if (map && (!highlightIds || highlightIds.length === 0)) {
			// Only fly to region macro view if no specific station is highlighted
			map.flyTo({
				center: regionObj.center,
				zoom: regionObj.zoom,
				duration: 2000
			});
		}
	}

	$effect(() => {
		if (map && innerWidth) {
			const leftPadding = innerWidth > 1024 ? innerWidth * 0.4 : 0;
			try {
				map.setPadding({ left: leftPadding, top: 0, bottom: 0, right: 0 });
			} catch (e) {
				console.warn('Map padding error:', e);
			}
		}
	});

	$effect(() => {
		if (region && typeof region === 'string') {
			let strippedRegion = region;
			// Normalizing region string to match hardcoded strings
			if (region.includes('Vancouver')) strippedRegion = 'Greater Vancouver';

			const found = regions.find((r) => r.name === strippedRegion);
			if (found) {
				zoomToRegion(found);
			}
		}
	});

	$effect(() => {
		const hasHighlights = Array.isArray(highlightIds) && highlightIds.length > 0;
		if (map && hasHighlights && stationData.length > 0) {
			const target = highlightIds[0];
			const station = stationData.find(
				(s) => s.stop_label === target || s.id === target || Number(s.id) === Number(target)
			);

			if (station) {
				map.flyTo({
					center: [station.longitude, station.latitude],
					zoom: 16,
					duration: 2000,
					essential: true
				});
			}

			if (map.isStyleLoaded()) {
				updateHighlightLayer();
			} else {
				map.once('idle', updateHighlightLayer);
			}
		} else if (map && !hasHighlights && map.isStyleLoaded()) {
			if (map.getLayer('potential-highlight')) {
				map.setFilter('potential-highlight', ['==', ['get', 'id'], -1]);
			}
		}
	});

	function updateHighlightLayer() {
		if (!map || !map.getLayer('potential')) return;

		const layerDef = map.getLayer('potential');
		const hasHighlights = Array.isArray(highlightIds) && highlightIds.length > 0;
		if (!hasHighlights) return;

		const filterArray = ['any'];
		for (const target of highlightIds) {
			filterArray.push(['==', ['get', 'stop_label'], String(target)]);
			filterArray.push(['==', ['get', 'name'], String(target)]);
			filterArray.push(['==', ['get', 'label'], String(target)]);

			if (!isNaN(target)) {
				filterArray.push(['==', ['get', 'id'], Number(target)]);
				filterArray.push(['==', ['get', 'id'], String(target)]);
			}
		}

		const layerConfig = {
			id: 'potential-highlight',
			type: 'circle',
			source: layerDef.source,
			paint: {
				'circle-radius': 14,
				'circle-color': 'transparent',
				'circle-stroke-color': '#0ea5e9', // Sky blue standout highlight
				'circle-stroke-width': 4
			},
			filter: filterArray
		};

		if (layerDef['source-layer'] || layerDef.sourceLayer) {
			layerConfig['source-layer'] = layerDef['source-layer'] || layerDef.sourceLayer;
		}

		if (!map.getLayer('potential-highlight')) {
			map.addLayer(layerConfig);
		} else {
			map.setFilter('potential-highlight', filterArray);
		}
	}

	// Crucial: Resize the map when it becomes visible
	$effect(() => {
		if (visible && map) {
			map.resize();
		}
	});

	onMount(async () => {
		try {
			const res = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			);
			stationData = await res.json();
		} catch (e) {
			console.error('Failed to load station coordinates for Map:', e);
		}

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmo1ub4fy008o01pcaldn704v',
			center: activeRegion.center,
			zoom: activeRegion.zoom,
			scrollZoom: false,
			attributionControl: false
		});

		const nav = new mapboxgl.NavigationControl();
		map.addControl(nav, 'bottom-left');

		map.keyboard.disable();
		map.touchZoomRotate.disable();
		map.dragRotate.disable();

		map.on('load', () => {
			if (highlightIds && highlightIds.length > 0) updateHighlightLayer();

			const popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false,
				className: 'mapbox-custom-popup',
				offset: 15
			});

			const layer = 'potential';
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
					const name =
						feature.properties.stop_label ||
						feature.properties.label ||
						feature.properties.name ||
						'Station';
					const content = `<div class="popup-inner">
						<div class="popup-title">${name}</div>
						<div class="line-label">${feature.properties.line_display_name}<br/>
							${feature.properties.status}
						</div>
						Overall Development Potential: 
						${feature.properties.potential} 
						</div>`;
					popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
				}
			});
		});

		return () => map.remove();
	});
</script>

<svelte:window bind:innerWidth />
<div class="map-wrapper {visible ? 'visible' : ''}">
	<div bind:this={mapContainer} class="map-container"></div>
	<div class="map-legend">
		<div class="legend-header text-xs">Land Availability</div>
		<div class="legend-grid">
			<div class="legend-header"></div>
			<!-- empty top-left corner -->
			<div class="legend-header"></div>
			<div class="legend-label">Low</div>
			<div class="legend-label">High</div>

			<div class="legend-side-label text-xs" style="grid-row: 2 / 4">Growth Pressure</div>
			<div class="legend-label">Low</div>
			<div class="legend-cell">
				<span class="legend-dot" style="background: #00adf2"></span>
			</div>
			<div class="legend-cell">
				<span class="legend-dot" style="background: #db3069"></span>
			</div>

			<div class="legend-label">High</div>
			<div class="legend-cell">
				<span class="legend-dot" style="background: #58e965"></span>
			</div>
			<div class="legend-cell">
				<span class="legend-dot" style="background: #f1c500"></span>
			</div>
		</div>
	</div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: #f1f5f9;
	}

	.map-container {
		width: 100%;
		height: 100%;
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
	:global(.line-label) {
		font-size: 0.65rem;
		text-transform: uppercase;
		font-weight: 700;
		color: #64748b;
		letter-spacing: 0.025em;
	}
	.map-legend {
		position: absolute;
		bottom: 15px;
		right: 25px;
		background: rgba(70, 70, 70, 0.75);
		backdrop-filter: blur(4px);
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 0.5rem 0.65rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.legend-grid {
		display: grid;
		grid-template-columns: auto auto 1fr 1fr; /* added a column for side label */
		gap: 0.3rem 0.6rem;
		align-items: center;
	}

	.legend-side-label {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-weight: 500;
		color: #ffffff;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-align: center;
		padding-right: 0.25rem;
		margin-right: 0.25rem;
	}

	.legend-header {
		font-weight: 500;
		color: #ffffff;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-align: right;
	}

	.legend-label {
		font-weight: 400;
		color: #ffffff;
		padding-right: 0.25rem;
		font-size: 0.75rem;
	}

	.legend-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}
</style>
