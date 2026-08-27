<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import '../../styles.css';

	let mapContainer;
	let map;
	let popup;
	let is3D = true;
	let showPts = true;

	const ZOOM1_LAYER_IDS = ['nova-scotia-nar-res5', 'pe-nar-res5', 'nb-nar-res5'];
	const ZOOM2_LAYER_IDS = ['nova-scotia-nar-res7', 'pe-nar-res7', 'nb-nar-res7'];
	const ZOOM3_LAYER_IDS = ['nova-scotia-nar-res9', 'pe-nar-res9', 'nb-nar-res9'];
	const POINT_LAYER_ID = 'nova-scotia-housing-points';

	function toggleProjection() {
		is3D = !is3D;
		map.easeTo({ pitch: is3D ? 60 : 0 });
	}

	function togglePts() {
		showPts = !showPts;
		map.setLayoutProperty(POINT_LAYER_ID, 'visibility', showPts ? 'visible' : 'none');
	}

	function updateZoomLayerVisibility() {
		const zoom = map.getZoom();
		console.log(zoom);

		let activeLayerIds;
		if (zoom >= 9.5) {
			activeLayerIds = ZOOM3_LAYER_IDS;
		} else if (zoom >= 7.5) {
			activeLayerIds = ZOOM2_LAYER_IDS;
		} else {
			activeLayerIds = ZOOM1_LAYER_IDS;
		}

		for (const layerId of [...ZOOM1_LAYER_IDS, ...ZOOM2_LAYER_IDS, ...ZOOM3_LAYER_IDS]) {
			if (!map.getLayer(layerId)) {
				console.warn(`Layer "${layerId}" not found in style`);
				continue;
			}
			map.setLayoutProperty(
				layerId,
				'visibility',
				activeLayerIds.includes(layerId) ? 'visible' : 'none'
			);
		}
	}

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cms90dbtc00d601s2avai9gvj',
			center: [-63.5859, 44.682],
			zoom: 10.5,
			pitch: 60,
			customAttribution: 'Canadian Urban Institute'
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		map.on('load', () => {
			console.log(
				'Style layers:',
				map.getStyle().layers.map((l) => l.id)
			);

			popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
			});

			const layerIds = [...ZOOM1_LAYER_IDS, ...ZOOM2_LAYER_IDS, ...ZOOM3_LAYER_IDS];

			map.on('mousemove', layerIds, (e) => {
				map.getCanvas().style.cursor = 'pointer';
				const { n_points } = e.features[0].properties;
				popup
					.setLngLat(e.lngLat)
					.setHTML(`<strong>${n_points.toLocaleString()}</strong> units`)
					.addTo(map);
			});

			map.on('mouseleave', layerIds, () => {
				map.getCanvas().style.cursor = '';
				popup.remove();
			});

			// First load
			updateZoomLayerVisibility();

			// Recalculate whenever zoom changes
			map.on('zoomend', updateZoomLayerVisibility);
		});

		return () => {
			if (map) map.remove();
		};
	});
</script>

<div class="hero">
	<h1>Housing Density</h1>
	<h2>Mapping Tool</h2>
	<p>
		This map shows the number of residential units across Canada. Zoom in and out to change the
		resolution of the map. Data from Statistics Canada's
		<a href="https://www150.statcan.gc.ca/n1/en/catalogue/46260002" target="_blank"
			>National Address Register</a
		>.
	</p>
	<p><a href="#map-container">Explore the map ↓</a></p>
</div>

<div id="map-container">
	<div bind:this={mapContainer} id="map"></div>
	<button id="projection-toggle" on:click={toggleProjection}>
		{is3D ? '2D' : '3D'}
	</button>
	<button id="pts-toggle" on:click={togglePts}>
		{showPts ? 'Hide NAR points' : 'Show NAR points'}
	</button>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	#map {
		width: 100%;
		height: 100%;
	}

	#map-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		scroll-margin-top: -80px;
	}

	#projection-toggle {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1;
		padding: 8px 14px;
		background: #ffffff;
		border: none;
		border-radius: 4px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		font-weight: 600;
	}

	#pts-toggle {
		position: absolute;
		top: 60px;
		right: 10px;
		z-index: 1;
		padding: 8px 14px;
		background: #ffffff;
		border: none;
		border-radius: 4px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		font-weight: 600;
	}
</style>
