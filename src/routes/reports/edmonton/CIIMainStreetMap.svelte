<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import "../../../../node_modules/mapbox-gl/dist/mapbox-gl.css";


	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let title;
	export let section;
	let center = [-113.376, 53.549];
	export let zoom = 7;
    export let maxZoom = 16;
    export let minZoom = 6;
	export let bearing = 0;
	export let pitch = 0;
	export let style = 'mapbox://styles/canadianurbaninstitute/clua3x3qv002801qp39gdfc4x?fresh=true';
	export let attribution = 'Canadian Urban Institute'


	let map;

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

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');
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

	});
</script>

<!-- Need to fix labels not working at some point -->

<div class="chart-container">
	<h4>{title}</h4>

<div id={section} class="map"/>

</div>

<style>
	.map {
		height: 500px;
		width: 100%;
		border-radius: 1em;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
	}
</style>
