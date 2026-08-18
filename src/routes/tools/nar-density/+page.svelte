<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import * as h3 from 'h3-js';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

	let mapContainer;
	let map;
	let popup;

	// Performance improvement
	// How to deal with different data densities:
	// upload different POINT_LAYERS for each province
	// have a if statement to check which layer to use based on
	// the centre coordinates of the viewport
	// then use conditional logic to adjust to zoom hex sizes.

	const POINT_LAYER_ID = 'nova-scotia-housing-points';
	let lastResolution;

	function zoomToH3Resolution(zoom) {
		if (zoom >= 10) return 9;
		if (zoom >= 8.5) return 7;
		if (zoom >= 7) return 6;

		return 5;
	}

	function updateHexbins() {
		const features = map
			.queryRenderedFeatures({ layers: [POINT_LAYER_ID] })
			.filter((f) => f.properties && f.properties.reppoint_latitude !== undefined);

		if (!features.length) {
			map.getSource('hexbins').setData(turf.featureCollection([]));
			return;
		}

		const resolution = zoomToH3Resolution(map.getZoom());

		// Don't recalculate if resolution hasn't changed
		if (resolution === lastResolution) {
			console.log('Not recalculating');
			return;
		}

		lastResolution = resolution;

		document.getElementById('zoom').textContent =
			`Zoom: ${map.getZoom().toFixed(2)} | H3 Resolution: ${resolution}`;

		const bins = new Map();

		for (const f of features) {
			const { reppoint_latitude: lat, reppoint_longitude: lng, unit_count } = f.properties;
			const cellId = h3.latLngToCell(lat, lng, resolution);

			const bin = bins.get(cellId) ?? { unit_count: 0, point_count: 0 };
			bin.unit_count += unit_count;
			bin.point_count += 1;
			bins.set(cellId, bin);
		}

		const hexbins = Array.from(bins.entries()).map(([cellId, props]) => {
			const boundary = h3.cellToBoundary(cellId, true);
			return turf.polygon([[...boundary, boundary[0]]], props);
		});

		map.getSource('hexbins').setData(turf.featureCollection(hexbins));
	}

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmebusgda001n01qw1y042h3q',
			center: [-63.5859, 44.682],
			zoom: 8
		});

		map.on('load', () => {
			map.addSource('hexbins', {
				type: 'geojson',
				data: turf.featureCollection([])
			});

			map.addLayer({
				id: 'hexbins-extrusion',
				type: 'fill-extrusion',
				source: 'hexbins',
				paint: {
					'fill-extrusion-color': '#ff4444',
					'fill-extrusion-height': ['*', ['get', 'unit_count'], 25],
					'fill-extrusion-base': 0,
					'fill-extrusion-opacity': 0.8
				}
			});

			popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
			});

			map.on('mousemove', 'hexbins-extrusion', (e) => {
				const props = e.features[0].properties;
				popup
					.setLngLat(e.lngLat)
					.setHTML(`<strong>${props.unit_count}</strong> units<br>${props.point_count} Locations`)
					.addTo(map);
			});

			map.on('mouseleave', 'hexbins-extrusion', () => {
				popup.remove();
			});

			// First load
			updateHexbins();

			// Recalculate whenever viewport changes OR zoom changes
			map.on('moveend', updateHexbins);
			map.on('zoomend', updateHexbins);
		});

		return () => {
			if (map) map.remove();
		};
	});
</script>

<h1>NAR Unit Density Map - Hexbins</h1>
<div id="map-container">
	<div bind:this={mapContainer} id="map"></div>
	<p id="zoom"></p>
</div>

<style>
	#map {
		width: 80%;
		height: 90vh;
	}

	#map-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
