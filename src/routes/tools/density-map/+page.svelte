<script>
  import { onMount } from 'svelte';
  import { MapboxOverlay } from '@deck.gl/mapbox';
  import { MVTLayer } from '@deck.gl/geo-layers';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  let mapContainer;
  let map;
  
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

  onMount(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/canadianurbaninstitute/cmdge4s08000g01s51sgiaaek',
      center: [-63.5859, 44.6820],
      zoom: 7
    });

    map.on('load', () => {
      const deckOverlay = new MapboxOverlay({
        layers: [
          new MVTLayer({
            id: 'housing',
            data: `https://api.mapbox.com/v4/canadianurbaninstitute.14olhrop/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_TOKEN}`,
            filled: true,
            getFillColor: [255, 0, 0, 100],
            getLineColor: [0, 0, 0],
            getLineWidth: 1,
            pointRadiusMinPixels: 5
          })
        ]
      });
      
      map.addControl(deckOverlay);
    });
  });
</script>

<h1>NAR Unit Density Map</h1>
<div id="map-container">
<div id="map" bind:this={mapContainer} style=""></div>
</div>

<style>
  #map {
    width: 80%; 
    height: 90vh;
  }

  #map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }


</style>