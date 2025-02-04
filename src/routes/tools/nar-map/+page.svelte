<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { MapboxOverlay } from '@deck.gl/mapbox';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import hexData from './canada_hexgrid.json';
  
	mapboxgl.accessToken = 'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
  
	let map;
	let deckOverlay;
  
	function getLayers() {
	  return [
		new H3HexagonLayer({
		  id: 'h3-hex-layer',
		  data: hexData,
		  pickable: true,
		  filled: true,
		  extruded: true,
		  getHexagon: d => d.hex_id,
		  getElevation: d => d.residential_count * 0.1, // Scale down elevation
		  getFillColor: [140, 140, 240, 200],
		  elevationScale: 1, // Increased scale to match terrain
		  wireframe: false,
		})
	  ];
	}
  
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
  
		// Initialize Deck.gl overlay with proper GL context
		deckOverlay = new MapboxOverlay({
		  interleaved: true,
		  layers: getLayers(),
		  glOptions: {
			// Match Mapbox's WebGL2 context
			alpha: true,
			depth: true,
			stencil: true,
			antialias: true
		  }
		});
  
		map.addControl(deckOverlay);
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