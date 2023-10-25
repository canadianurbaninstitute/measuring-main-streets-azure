<script>
	import '../styles.css';
	import { onMount } from 'svelte';	import mapboxgl from 'mapbox-gl';

	import Legend from '../lib/ui/legends/Legend.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA';

	export let map;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/ananmay/clnc7tpm907rd01p93bgs013m?&fresh=true?optimize=true',
			center: [-97, 54],
			zoom: 3.9,
			minZoom: 2,
			scrollZoom: true
		});

		map.addControl(new mapboxgl.NavigationControl());

		// Geocoder Search

		map.on('load', () => {
			map.addControl(
				new MapboxGeocoder({
					accessToken: mapboxgl.accessToken,
					countries: 'ca',
					proximity: 'ip',
					types: 'address, region, country, postcode, district, place, locality, neighborhood',
					language: 'en, fr',
					marker: true,
					placeholder: 'Search for a place',
					mapboxgl: mapboxgl
				}),
				'top-left'
			);
		});

        map.on('click', 'mainstreets-canada', (e) => {
            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.R_STNAM)
            .addTo(map);
            });
            
            // Change the cursor to a pointer when
            // the mouse is over the states layer.
            map.on('mouseenter', 'mainstreets-canada', () => {
            map.getCanvas().style.cursor = 'pointer';
            });
            
            // Change the cursor back to a pointer
            // when it leaves the states layer.
            map.on('mouseleave', 'mainstreets-canada', () => {
            map.getCanvas().style.cursor = '';
            });
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
	<script
		src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"
	></script>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
		type="text/css"
	/>
</svelte:head>

<div id="map-container">
	<div id="map" />

	<div id="legend">
		<Legend
			minlabel={'Low'}
			maxlabel={'High'}
			label={'Business Density'}
			gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
		/>
	</div>
</div>

<style>
	:global(body) {
		padding: 0px;
		margin: 0px;
		background-color: white;
	}

	#map {
		height: 90vh;
		width: 100%;
		position: absolute;
	}

	#map-container {
		display: flex;
	}

	@media screen and (min-width: 640px) {
		#legend {
			position: relative;
			top: 3.5em;
			left: 0.5em;
			width: 15vw;
			background-color: #fff;
			padding: 1em;
			border-radius: 0.6em;
			border: 1px solid #eee;
			max-width: 360px;
		}
	}
</style>
