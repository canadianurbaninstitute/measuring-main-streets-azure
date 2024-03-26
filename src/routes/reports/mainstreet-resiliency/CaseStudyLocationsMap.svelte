<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let center = [-79.37, 43.715];
	let zoom = 9.5;
    let maxZoom = 16.5;
    let minZoom = 8.5;
	let bearing = -17.1;
	let pitch = 0;
	let attribution = 'Canadian Urban Institute';
	let style = 'mapbox://styles/mapbox/light-v11';


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
            container: 'case-studies-map',
			style: style,
			center: center,
			zoom: zoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			bearing: bearing,
			pitch: pitch,
			projection: 'globe',
			scrollZoom: false,
			// maxBounds: maxBounds,
			attributionControl: false
		});

		// map.addControl(new mapboxgl.NavigationControl(), 'top-left');
		// map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
		// map.addControl(
		// 		new mapboxgl.AttributionControl({
		// 			customAttribution: attribution
		// 		})
		// 	);
	});
</script>


<div id="case-studies-map" class="map"/>

<style>
	.map {
		border: 2px solid #dddddd;
		border-radius: 0.8em;
        height: 500px;
        width: 100%;
	}
</style>
