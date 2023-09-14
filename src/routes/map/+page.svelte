<script>
    import '../styles.css'
    import { onMount } from 'svelte';
	import mapboxgl from "mapbox-gl";

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA';

    // onMount(() => {
    //     map = new mapboxgl.Map({
    //         container: 'map', 
    //         style: 'mapbox://styles/mapbox/light-v11',
    //         center: [-97, 55], 
    //         zoom: 3.9,
    //         minZoom: 2,
    //         scrollZoom: true,
    //     });

    //     const nav = new mapboxgl.NavigationControl();
    //     map.addControl(nav, 'top-right');

    // });   

</script>

<svelte:head>
    <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.0-beta.1/mapbox-gl.css' rel='stylesheet' />
</svelte:head>


<div id="map"></div>

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
</style>