<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { visitorMapStore, mapStoreList } from './mapStore';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let section;
	export let center = [-79.37, 43.715];
	export let zoom = 9.5;
    export let maxZoom = 16.5;
    export let minZoom = 8.5;
	export let bearing = -17.1;
	export let pitch = 0;
	export let layers = [];
	export let attribution = 'Canadian Urban Institute';
	export let style = 'mapbox://styles/mapbox/light-v11';

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
			attributionControl: false
		});

		visitorMapStore.set(map);

		mapStoreList.update(maps => ({ ...maps, [section]: map }));

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
		map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution: attribution
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
				console.log(coordsArray, 'pitch:', pitch, 'bearing:', bearing)
				});

		map.on('load', function () {

            let allLayers = map.getStyle().layers;

            var baseLayerSourceLayers = ['road', 'admin', 'landuse', 'landuse_overlay', 'water', 'waterway', 'structure', 'building', 'natural_label'];

            allLayers.forEach(function(layer) {
                // Check if the layer is 'land', or if the source-layer is not in the list of base layers
                if (layer.id === 'land' || (layer['source-layer'] && !baseLayerSourceLayers.includes(layer['source-layer']))) {
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

<div id={section} class="map" style="height: {mapHeight}px" />

<style>
	.map {
		border: 2px solid #dddddd;
		border-radius: 0.8em;
	}
</style>
