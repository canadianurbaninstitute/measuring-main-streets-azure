<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA';

	export let section;
	export let center = [-79.37, 43.715];
	export let zoom = 9.5;
    export let maxZoom = 16.5;
    export let minZoom = 8.5;
	export let bearing = -17.1;
	export let pitch = 0;
	export let layers = [];

	let pageHeight;
	let pageWidth;

	let mapHeight = 600;
	$: if (pageHeight < 800) {
		mapHeight = pageHeight - 200;
	} else {
		mapHeight = 600;
	}

	let map;

	const maxBounds = [
		[-79.6772, 43.44], // SW coords
		[-79.04763, 44.03074] // NE coords
	];

	onMount(() => {
		map = new mapboxgl.Map({
			container: section,
			style: 'mapbox://styles/ananmay/clo7jlaht00mt01qp7mnxcr21',
			center: center,
			zoom: zoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			bearing: bearing,
			pitch: pitch,
			projection: 'globe',
			scrollZoom: false,
			maxBounds: maxBounds,
			attributionControl: true
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

		//map.scrollZoom.disable();

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
				console.log(layerName);
				map.setLayoutProperty(layerName, 'visibility', 'visible');
			});
		});
	});
</script>

<svelte:window bind:innerHeight={pageHeight} bind:innerWidth={pageWidth} />

<div id={section} class="map" style="height: {mapHeight}px" />

<style>
	.map {
		width: 100%;
		border: 2px solid #dddddd;
		border-radius: 0.8em;
	}
</style>
