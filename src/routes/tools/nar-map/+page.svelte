<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import hexData from './canada_hexgrid.json';
  
	mapboxgl.accessToken = 'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
  
	let map;
	let deckOverlay;
  

	onMount(() => {
	  map = new mapboxgl.Map({
		useWebGL2: true,
		container: 'map',
		style: 'mapbox://styles/mapbox/dark-v11',
		center: [-90, 55],
		zoom: 3.5,
		pitch: 45,
		bearing: 0,
		antialias: true // Enable anti-aliasing
	  });
  
	  map.on('load', () => {
		// Add terrain source
		map.addSource('mapbox-dem', {
		  type: 'raster-dem',
		  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
		  tileSize: 512,
		  maxzoom: 14
		});
		
		// Enable terrain with exaggeration
		map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
  
		map.addControl(new mapboxgl.NavigationControl());
	  });
	});
  
	onDestroy(() => {
	  if (map) map.remove();
	  if (deckOverlay) deckOverlay.finalize();
	});
  </script>
  
  <svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
  </svelte:head>
  
  <div class="map-container">
	<div id="map"></div>
  </div>
  
  <style>
	#map {
	  height: 80vh;
	  width: 100%;
	  position: relative;
	}
	
	.map-container {
	  height: 100vh;
	  width: 100vw;
	}
  </style>