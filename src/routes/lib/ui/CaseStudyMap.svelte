<script>
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { mapStoreList, visitorMapStore } from '../stores/mapStore';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { getLang } from '../i18n';

	const fr = getLang() === 'fr';

	// Canadian French labels for the built-in Mapbox controls (tooltips and screen-reader text).
	const MAPBOX_LOCALE_FR = {
		'AttributionControl.ToggleAttribution': 'Afficher ou masquer l’attribution',
		'AttributionControl.MapFeedback': 'Commentaires sur la carte',
		'FullscreenControl.Enter': 'Passer en plein écran',
		'FullscreenControl.Exit': 'Quitter le plein écran',
		'GeolocateControl.FindMyLocation': 'Trouver ma position',
		'GeolocateControl.LocationNotAvailable': 'Position non disponible',
		'LogoControl.Title': 'Logo de Mapbox',
		'Map.Title': 'Carte',
		'NavigationControl.ResetBearing': 'Réorienter vers le nord',
		'NavigationControl.ZoomIn': 'Zoom avant',
		'NavigationControl.ZoomOut': 'Zoom arrière',
		'ScrollZoomBlocker.CtrlMessage': 'Utilisez Ctrl + défilement pour zoomer sur la carte',
		'ScrollZoomBlocker.CmdMessage': 'Utilisez ⌘ + défilement pour zoomer sur la carte',
		'TouchPanBlocker.Message': 'Utilisez deux doigts pour déplacer la carte'
	};

	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	export let section;
	export let center = [-79.37, 43.715];
	export let zoom = 9.5;
	export let maxZoom = 16.5;
	export let minZoom = 8.5;
	export let bearing = -17.1;
	export let pitch = 0;
	export let layers = [];
	export let attribution = fr ? 'Institut urbain du Canada' : 'Canadian Urban Institute';
	export let style = 'mapbox://styles/mapbox/light-v11';

	// Pages may pass the English attribution; translate its known parts on French pages.
	/** @param {string} text */
	function localizeAttribution(text) {
		if (!fr || typeof text !== 'string') return text;
		return text
			.replace('Canadian Urban Institute', 'Institut urbain du Canada')
			.replace('Data Source:', 'Source des données\u00a0:');
	}

	let pageHeight;
	let pageWidth;

	let mapHeight = 600;
	$: if (pageHeight < 800) {
		mapHeight = pageHeight - 200;
	} else {
		mapHeight = 600;
	}

	export let map;

	onMount(() => {
		map = new mapboxgl.Map({
			container: section,
			style: style,
			center: center,
			zoom: zoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			bearing: bearing,
			pitch: pitch,
			projection: 'globe',
			scrollZoom: false,
			attributionControl: false,
			...(fr ? { locale: MAPBOX_LOCALE_FR } : {})
		});

		visitorMapStore.set(map);

		mapStoreList.update((maps) => ({ ...maps, [section]: map }));

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: localizeAttribution(attribution)
			})
		);

		map.on('click', (e) => {
			const coords = JSON.stringify(map.getCenter());
			const pitch = map.getPitch().toFixed(0);
			const bearing = map.getBearing().toFixed(0);
			const coordsObject = JSON.parse(coords);
			const coordsArray = [
				parseFloat(coordsObject.lng.toFixed(4)),
				parseFloat(coordsObject.lat.toFixed(4))
			];
		});

		map.on('load', function () {
			let allLayers = map.getStyle().layers;

			var baseLayerSourceLayers = [
				'road',
				'admin',
				'landuse',
				'landuse_overlay',
				'water',
				'waterway',
				'structure',
				'building',
				'natural_label'
			];

			allLayers.forEach(function (layer) {
				// Check if the layer is 'land', or if the source-layer is not in the list of base layers
				if (
					layer.id === 'land' ||
					(layer['source-layer'] && !baseLayerSourceLayers.includes(layer['source-layer']))
				) {
					// If it's the 'land' layer or not in the list of base layers, hide it
					map.setLayoutProperty(layer.id, 'visibility', 'none');
				}
			});

			layers.forEach(function (layerName) {
				map.setLayoutProperty(layerName, 'visibility', 'visible');
			});
		});
	});
</script>

<svelte:window bind:innerHeight={pageHeight} bind:innerWidth={pageWidth} />

<div id={section} class="map" style="height: {mapHeight}px"></div>

<style>
	.map {
		border: 2px solid #dddddd;
		border-radius: 0.8em;
	}
</style>
